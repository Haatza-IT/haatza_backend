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
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
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
   * If `raw=true` is sent by CMS/admin, returns raw widget records.
   * Otherwise returns the unified Customer Dashboard response.
   *
   * Example:
   * GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56
   */
  @Get()
  async getDashboard(
    @Query(new ZodValidationPipe(customerDashboardQuerySchema)) query: CustomerDashboardQueryInput,
  ): Promise<CustomerDashboardResponse | DashboardListResponse> {
    if (query.raw) {
      return this.dashboardService.findAllWidgets(query);
    }
    return this.dashboardService.getCustomerDashboard(query);
  }

  /**
   * Explicit Customer Dashboard endpoint.
   *
   * Example:
   * GET /api/dashboard/customer?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56
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
   * Retrieves a single dashboard widget by widget_id.
   * Method: GET /api/dashboard/:id
   */
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
