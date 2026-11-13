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
} from './dashboard.types';

@Controller(['api/dashboard', 'dashboard'])
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

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
   * Retrieves all dashboard widgets with optional filtering, search, and pagination.
   * Method: GET /api/dashboard or GET /dashboard
   */
  @Get()
  async findAllWidgets(
    @Query(new ZodValidationPipe(dashboardQuerySchema)) query: DashboardQueryDto,
  ): Promise<DashboardListResponse> {
    return this.dashboardService.findAllWidgets(query);
  }

  /**
   * Retrieves a single dashboard widget by Widget_id.
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
   * Deletes a dashboard widget by Widget_id.
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
