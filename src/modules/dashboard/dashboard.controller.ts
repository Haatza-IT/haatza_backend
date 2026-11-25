import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import * as crypto from 'crypto';
import { DashboardService } from './dashboard.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import {
  createDashboardSchema,
  updateDashboardSchema,
  customerDashboardQuerySchema,
  type CustomerDashboardQueryInput,
} from './dashboard.schema';
import type {
  CreateDashboardDto,
  UpdateDashboardDto,
  DashboardResponse,
  DashboardListResponse,
  CustomerDashboardResponse,
} from './dashboard.types';

@Controller(['api/dashboard', 'dashboard'])
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Primary Customer Dashboard endpoint.
   * If `raw=true` is sent by CMS/admin, requires admin authentication and returns raw widget records.
   * Otherwise returns the unified Customer Dashboard response (public access).
   *
   * Example:
   * GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56&placement=DESKTOP
   */
  @Get()
  async getDashboard(
    @Query(new ZodValidationPipe(customerDashboardQuerySchema)) query: CustomerDashboardQueryInput,
    @Req() req: Request,
  ): Promise<CustomerDashboardResponse | DashboardListResponse> {
    if (query.raw) {
      this.validateAdminAccess(req);
      return this.dashboardService.findAllWidgets(query);
    }
    return this.dashboardService.getCustomerDashboard(query);
  }

  /**
   * Explicit Customer Dashboard endpoint.
   *
   * Example:
   * GET /api/dashboard/customer?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56&placement=DESKTOP
   */
  @Get('customer')
  async getCustomerDashboard(
    @Query(new ZodValidationPipe(customerDashboardQuerySchema)) query: CustomerDashboardQueryInput,
  ): Promise<CustomerDashboardResponse> {
    return this.dashboardService.getCustomerDashboard(query);
  }

  /**
   * Admin Endpoint: Clears the in-memory dashboard cache immediately.
   * Method: POST /api/dashboard/cache/clear
   * Header: x-admin-key: <ADMIN_API_KEY>
   */
  @UseGuards(AdminAuthGuard)
  @Post('cache/clear')
  @HttpCode(HttpStatus.OK)
  async clearCache(): Promise<{ success: boolean; message: string }> {
    this.dashboardService.clearCache();
    return {
      success: true,
      message: 'Dashboard cache cleared successfully.',
    };
  }

  /**
   * Admin Endpoint: Seed/re-initialize the 169 HAATZA dashboard rows.
   * Method: POST /api/dashboard/seed
   * Header: x-admin-key: <ADMIN_API_KEY>
   * Uses ON CONFLICT (widget_id) DO NOTHING: safe to re-run and never overwrites.
   */
  @UseGuards(AdminAuthGuard)
  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seedDashboard(): Promise<{ success: boolean; inserted: number; message: string }> {
    const result = await this.dashboardService.seedDashboard();
    return {
      success: true,
      inserted: result.totalInserted,
      message: `Seed completed: ${result.totalInserted} row(s) processed out of ${result.totalAttempted} attempted.`,
    };
  }

  /**
   * Creates a new dashboard widget.
   * Method: POST /api/dashboard
   */
  @UseGuards(AdminAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWidget(
    @Body(new ZodValidationPipe(createDashboardSchema)) dto: CreateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.createWidget(dto);
  }

  /**
   * Validates admin authentication for raw listing requests.
   */
  private validateAdminAccess(req: Request): void {
    const adminKeyHeader = req.headers['x-admin-key'];
    const authHeader = req.headers['authorization'];

    let suppliedKey: string | null = null;
    if (adminKeyHeader) {
      suppliedKey = Array.isArray(adminKeyHeader)
        ? adminKeyHeader[0].trim()
        : String(adminKeyHeader).trim();
    } else if (authHeader) {
      const authStr = Array.isArray(authHeader) ? authHeader[0].trim() : String(authHeader).trim();
      if (authStr.startsWith('Bearer ')) {
        suppliedKey = authStr.substring(7).trim();
      } else {
        suppliedKey = authStr;
      }
    }

    if (!suppliedKey || suppliedKey.length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication required: Admin API key is missing. Provide x-admin-key or Authorization Bearer header.',
        errors: [],
      });
    }

    const expectedSecret = process.env.ADMIN_API_KEY;
    if (!expectedSecret || expectedSecret.trim().length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication failed: Server administrator authentication is not configured.',
        errors: [],
      });
    }

    const hashA = crypto.createHash('sha256').update(suppliedKey).digest();
    const hashB = crypto.createHash('sha256').update(expectedSecret.trim()).digest();
    if (!crypto.timingSafeEqual(hashA, hashB)) {
      throw new ForbiddenException({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        errors: [],
      });
    }
  }

  /**
   * Retrieves a single dashboard widget by widget_id.
   * Method: GET /api/dashboard/:id
   */
  @UseGuards(AdminAuthGuard)
  @Get(':id')
  async findWidgetById(
    @Param('id') id: string,
  ): Promise<DashboardResponse> {
    return this.dashboardService.findWidgetById(id);
  }

  /**
   * Updates an existing dashboard widget completely.
   * Method: PUT /api/dashboard/:id
   */
  @UseGuards(AdminAuthGuard)
  @Put(':id')
  async updateWidget(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDashboardSchema)) dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.updateWidget(id, dto);
  }

  /**
   * Updates an existing dashboard widget partially.
   * Method: PATCH /api/dashboard/:id
   */
  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  async patchWidget(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDashboardSchema)) dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.updateWidget(id, dto);
  }

  /**
   * Deletes a dashboard widget by widget_id.
   * Method: DELETE /api/dashboard/:id
   */
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteWidget(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.dashboardService.deleteWidget(id);
  }
}
