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
  Inject,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createDashboardSchema,
  updateDashboardSchema,
  dashboardQuerySchema,
} from './dashboard.schema';
import type {
  CreateDashboardDto,
  UpdateDashboardDto,
  DashboardQueryDto,
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
   * Primary Customer & Admin Dashboard endpoint.
   * If `module` is specified (e.g. ?module=SHOPPING or ?module=LITE) and `raw` is not true,
   * returns the customer-facing dashboard with populated products, categories, and banners.
   * If `raw=true` or no module is specified, returns the raw widget configurations for admin/CMS.
   * 
   * Methods:
   * GET /api/dashboard?module=SHOPPING
   * GET /api/dashboard?module=LITE
   */
  @Get()
  async getDashboard(
    @Query(new ZodValidationPipe(dashboardQuerySchema)) query: DashboardQueryDto & { raw?: boolean },
  ): Promise<CustomerDashboardResponse | DashboardListResponse> {
    if (query.module && !query.raw) {
      return this.dashboardService.getCustomerDashboard(query);
    }
    return this.dashboardService.findAllWidgets(query);
  }

  /**
   * Explicit Customer Dashboard endpoint.
   * Methods:
   * GET /api/dashboard/customer?module=SHOPPING
   * GET /api/dashboard/customer?module=LITE
   */
  @Get('customer')
  async getCustomerDashboard(
    @Query(new ZodValidationPipe(dashboardQuerySchema)) query: DashboardQueryDto,
  ): Promise<CustomerDashboardResponse> {
    return this.dashboardService.getCustomerDashboard(query);
  }

  /**
   * Seed / Re-initialize default widget configurations in PostgreSQL.
   * Method: POST /api/dashboard/seed?module=SHOPPING
   */
  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seedDefaultWidgets(
    @Query('module') module?: string,
  ): Promise<{ success: boolean; seeded: number; message: string }> {
    const seeded = await this.dashboardService.seedDefaultWidgets(module);
    return {
      success: true,
      seeded,
      message: `Successfully seeded ${seeded} default widget configuration(s) into database.`,
    };
  }

  /**
   * Creates a new dashboard widget.
   * Method: POST /api/dashboard or POST /dashboard
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWidget(
    @Body(new ZodValidationPipe(createDashboardSchema)) dto: CreateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.createWidget(dto);
  }

  /**
   * Retrieves a single dashboard widget by widget_id.
   * Method: GET /api/dashboard/:id or GET /dashboard/:id
   */
  @Get(':id')
  async findWidgetById(
    @Param('id') id: string,
  ): Promise<DashboardResponse> {
    return this.dashboardService.findWidgetById(id);
  }

  /**
   * Updates an existing dashboard widget completely.
   * Method: PUT /api/dashboard/:id or PUT /dashboard/:id
   */
  @Put(':id')
  async updateWidget(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDashboardSchema)) dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.updateWidget(id, dto);
  }

  /**
   * Updates an existing dashboard widget partially.
   * Method: PATCH /api/dashboard/:id or PATCH /dashboard/:id
   */
  @Patch(':id')
  async patchWidget(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDashboardSchema)) dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    return this.dashboardService.updateWidget(id, dto);
  }

  /**
   * Deletes a dashboard widget by widget_id.
   * Method: DELETE /api/dashboard/:id or DELETE /dashboard/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteWidget(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.dashboardService.deleteWidget(id);
  }
}
