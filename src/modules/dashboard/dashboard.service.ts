import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  CreateDashboardDto,
  UpdateDashboardDto,
  DashboardQueryDto,
  DashboardResponse,
  DashboardListResponse,
  DashboardWidget,
} from './dashboard.types';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Helper to format a database Dashboard record for API responses.
   * Returns exact 9 fields.
   */
  private formatWidget(record: any): DashboardWidget {
    return {
      Widget_id: record.Widget_id,
      Widget_name: record.Widget_name,
      Redirected_to: record.Redirected_to ?? null,
      Placement: record.Placement ?? null,
      Sequence: record.Sequence ?? null,
      Territory: record.Territory ?? null,
      Items: Array.isArray(record.Items) ? record.Items : [],
      Product_Id: record.Product_Id ?? null,
      Category_Id: record.Category_Id ?? null,
    };
  }

  /**
   * Creates a new Dashboard widget.
   * Throws 409 ConflictException if Widget_id already exists.
   */
  async createWidget(dto: CreateDashboardDto): Promise<DashboardResponse> {
    const existing = await this.prisma.dashboard.findUnique({
      where: { Widget_id: dto.Widget_id },
    });

    if (existing) {
      throw new ConflictException(
        `Dashboard widget with Widget_id '${dto.Widget_id}' already exists.`,
      );
    }

    const created = await this.prisma.dashboard.create({
      data: {
        Widget_id: dto.Widget_id.trim(),
        Widget_name: dto.Widget_name.trim(),
        Redirected_to: dto.Redirected_to?.trim() || null,
        Placement: dto.Placement?.trim() || null,
        Sequence: dto.Sequence !== undefined && dto.Sequence !== null ? Number(dto.Sequence) : null,
        Territory: dto.Territory?.trim() || null,
        Items: Array.isArray(dto.Items) ? dto.Items : [],
        Product_Id: dto.Product_Id?.trim() || null,
        Category_Id: dto.Category_Id?.trim() || null,
      },
    });

    return {
      success: true,
      data: this.formatWidget(created),
      message: 'Dashboard widget created successfully.',
    };
  }

  /**
   * Lists dashboard widgets with optional filters, search, and pagination.
   */
  async findAllWidgets(query: DashboardQueryDto): Promise<DashboardListResponse> {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(Number(query.limit), 100) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.placement) {
      where.Placement = { equals: query.placement, mode: 'insensitive' };
    }
    if (query.territory) {
      where.Territory = { equals: query.territory, mode: 'insensitive' };
    }
    if (query.sequence !== undefined && query.sequence !== null) {
      where.Sequence = { equals: Number(query.sequence) };
    }
    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { Widget_name: { contains: search, mode: 'insensitive' } },
        { Widget_id: { contains: search, mode: 'insensitive' } },
        { Placement: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, records] = await Promise.all([
      this.prisma.dashboard.count({ where }),
      this.prisma.dashboard.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ Sequence: 'asc' }],
      }),
    ]);

    return {
      success: true,
      data: records.map((record: any) => this.formatWidget(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Retrieves a single dashboard widget by Widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async findWidgetById(widgetId: string): Promise<DashboardResponse> {
    const record = await this.prisma.dashboard.findUnique({
      where: { Widget_id: widgetId },
    });

    if (!record) {
      throw new NotFoundException(
        `Dashboard widget with Widget_id '${widgetId}' was not found.`,
      );
    }

    return {
      success: true,
      data: this.formatWidget(record),
    };
  }

  /**
   * Updates an existing dashboard widget by Widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async updateWidget(
    widgetId: string,
    dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    const existing = await this.prisma.dashboard.findUnique({
      where: { Widget_id: widgetId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Dashboard widget with Widget_id '${widgetId}' was not found.`,
      );
    }

    const updateData: any = {};

    if (dto.Widget_name !== undefined) {
      updateData.Widget_name = dto.Widget_name ? dto.Widget_name.trim() : existing.Widget_name;
    }
    if (dto.Redirected_to !== undefined) {
      updateData.Redirected_to = dto.Redirected_to?.trim() || null;
    }
    if (dto.Placement !== undefined) {
      updateData.Placement = dto.Placement?.trim() || null;
    }
    if (dto.Sequence !== undefined) {
      updateData.Sequence = dto.Sequence !== null ? Number(dto.Sequence) : null;
    }
    if (dto.Territory !== undefined) {
      updateData.Territory = dto.Territory?.trim() || null;
    }
    if (dto.Items !== undefined) {
      updateData.Items = Array.isArray(dto.Items) ? dto.Items : [];
    }
    if (dto.Product_Id !== undefined) {
      updateData.Product_Id = dto.Product_Id?.trim() || null;
    }
    if (dto.Category_Id !== undefined) {
      updateData.Category_Id = dto.Category_Id?.trim() || null;
    }

    const updated = await this.prisma.dashboard.update({
      where: { Widget_id: widgetId },
      data: updateData,
    });

    return {
      success: true,
      data: this.formatWidget(updated),
      message: 'Dashboard widget updated successfully.',
    };
  }

  /**
   * Deletes a dashboard widget by Widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async deleteWidget(widgetId: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.dashboard.findUnique({
      where: { Widget_id: widgetId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Dashboard widget with Widget_id '${widgetId}' was not found.`,
      );
    }

    await this.prisma.dashboard.delete({
      where: { Widget_id: widgetId },
    });

    return {
      success: true,
      message: `Dashboard widget with Widget_id '${widgetId}' was deleted successfully.`,
    };
  }
}
