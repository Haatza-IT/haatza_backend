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
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 30000; // 30 seconds

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setInCache<T>(key: string, data: T, ttlMs = this.CACHE_TTL_MS): void {
    if (this.cache.size > 200) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Helper to format a database Dashboard record for API responses.
   * Returns exact 18 fields in standard contract.
   */
  private formatWidget(record: any): DashboardWidget {
    return {
      widget_id: record.widgetId ?? record.widget_id,
      widget_name: record.widgetName ?? record.widget_name,
      widget_redirect_to: record.widgetRedirectTo ?? record.widget_redirect_to ?? null,
      placement: record.placement ?? null,
      sequence: record.sequence !== null && record.sequence !== undefined ? Number(record.sequence) : null,
      territory: record.territory ?? null,
      items: Array.isArray(record.items) ? record.items : [],
      product_id: record.productId ?? record.product_id ?? null,
      category_id: record.categoryId ?? record.category_id ?? null,
      warehouse_id: record.warehouseId ?? record.warehouse_id ?? null,
      redirect_category_id: record.redirectCategoryId ?? record.redirect_category_id ?? null,
      redirect_product_id: record.redirectProductId ?? record.redirect_product_id ?? null,
      effective_from: record.effectiveFrom ? new Date(record.effectiveFrom).toISOString() : null,
      effective_to: record.effectiveTo ? new Date(record.effectiveTo).toISOString() : null,
      status: record.status !== undefined ? Boolean(record.status) : true,
      module: record.module ?? null,
      created_by: record.createdBy ?? record.created_by ?? null,
      updated_by: record.updatedBy ?? record.updated_by ?? null,
      created_at: record.createdAt ? new Date(record.createdAt).toISOString() : undefined,
      updated_at: record.updatedAt ? new Date(record.updatedAt).toISOString() : undefined,
    };
  }

  /**
   * Creates a new Dashboard widget with the 18-column configuration structure.
   * Throws 409 ConflictException if widget_id already exists.
   */
  async createWidget(dto: CreateDashboardDto): Promise<DashboardResponse> {
    const widgetId = (dto.widget_id || dto.Widget_id || '').trim();

    const existing = await this.prisma.dashboard.findUnique({
      where: { widgetId },
    });

    if (existing) {
      throw new ConflictException(
        `Dashboard widget with widget_id '${widgetId}' already exists.`,
      );
    }

    const created = await this.prisma.dashboard.create({
      data: {
        widgetId,
        widgetName: (dto.widget_name || dto.Widget_name || '').trim(),
        widgetRedirectTo: dto.widget_redirect_to?.trim() ?? dto.Redirected_to?.trim() ?? null,
        placement: dto.placement?.trim() ?? dto.Placement?.trim() ?? null,
        sequence: dto.sequence !== undefined && dto.sequence !== null ? Number(dto.sequence) : (dto.Sequence !== undefined && dto.Sequence !== null ? Number(dto.Sequence) : null),
        territory: dto.territory?.trim() ?? dto.Territory?.trim() ?? null,
        items: Array.isArray(dto.items) ? dto.items : (Array.isArray(dto.Items) ? dto.Items : []),
        productId: dto.product_id?.trim() ?? dto.Product_Id?.trim() ?? null,
        categoryId: dto.category_id?.trim() ?? dto.Category_Id?.trim() ?? null,
        warehouseId: dto.warehouse_id?.trim() ?? null,
        redirectCategoryId: dto.redirect_category_id?.trim() ?? null,
        redirectProductId: dto.redirect_product_id?.trim() ?? null,
        effectiveFrom: dto.effective_from ? new Date(dto.effective_from) : null,
        effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null,
        status: dto.status !== undefined ? Boolean(dto.status) : true,
        module: dto.module?.trim() ?? null,
        createdBy: dto.created_by?.trim() ?? null,
        updatedBy: dto.updated_by?.trim() ?? null,
      },
    });

    this.clearCache();

    return {
      success: true,
      data: this.formatWidget(created),
      message: 'Dashboard widget created successfully.',
    };
  }

  /**
   * Lists dashboard widgets with optional filters, search, and pagination.
   * Supports active_only time-based filtering for live campaigns.
   */
  async findAllWidgets(query: DashboardQueryDto): Promise<DashboardListResponse> {
    const cacheKey = `widgets:${JSON.stringify(query)}`;
    const cached = this.getFromCache<DashboardListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(Number(query.limit), 100) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.module) {
      where.module = { equals: query.module, mode: 'insensitive' };
    }
    if (query.placement) {
      where.placement = { equals: query.placement, mode: 'insensitive' };
    }
    if (query.territory) {
      where.territory = { equals: query.territory, mode: 'insensitive' };
    }
    if (query.warehouse_id) {
      where.warehouseId = { equals: query.warehouse_id, mode: 'insensitive' };
    }
    if (query.sequence !== undefined && query.sequence !== null) {
      where.sequence = { equals: Number(query.sequence) };
    }
    if (query.status !== undefined) {
      where.status = { equals: Boolean(query.status) };
    }

    // Active-only campaign filter: status is true and current time falls within effective range
    if (query.active_only) {
      const now = new Date();
      where.status = true;
      where.AND = [
        {
          OR: [
            { effectiveFrom: null },
            { effectiveFrom: { lte: now } },
          ],
        },
        {
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: now } },
          ],
        },
      ];
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { widgetName: { contains: search, mode: 'insensitive' } },
        { widgetId: { contains: search, mode: 'insensitive' } },
        { placement: { contains: search, mode: 'insensitive' } },
        { module: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, records] = await Promise.all([
      this.prisma.dashboard.count({ where }),
      this.prisma.dashboard.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sequence: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const response: DashboardListResponse = {
      success: true,
      data: records.map((record: any) => this.formatWidget(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };

    this.setInCache(cacheKey, response);
    return response;
  }

  /**
   * Retrieves a single dashboard widget by widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async findWidgetById(widgetId: string): Promise<DashboardResponse> {
    const trimmedId = widgetId.trim();
    const cacheKey = `widget:${trimmedId}`;
    const cached = this.getFromCache<DashboardResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const record = await this.prisma.dashboard.findUnique({
      where: { widgetId: trimmedId },
    });

    if (!record) {
      throw new NotFoundException(
        `Dashboard widget with widget_id '${trimmedId}' was not found.`,
      );
    }

    const response: DashboardResponse = {
      success: true,
      data: this.formatWidget(record),
    };

    this.setInCache(cacheKey, response);
    return response;
  }

  /**
   * Updates an existing dashboard widget by widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async updateWidget(
    widgetId: string,
    dto: UpdateDashboardDto,
  ): Promise<DashboardResponse> {
    const trimmedId = widgetId.trim();
    const existing = await this.prisma.dashboard.findUnique({
      where: { widgetId: trimmedId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Dashboard widget with widget_id '${trimmedId}' was not found.`,
      );
    }

    const updateData: any = {};

    if (dto.widget_name !== undefined || dto.Widget_name !== undefined) {
      updateData.widgetName = (dto.widget_name ?? dto.Widget_name)?.trim() || existing.widgetName;
    }
    if (dto.widget_redirect_to !== undefined || dto.Redirected_to !== undefined) {
      updateData.widgetRedirectTo = (dto.widget_redirect_to ?? dto.Redirected_to)?.trim() || null;
    }
    if (dto.placement !== undefined || dto.Placement !== undefined) {
      updateData.placement = (dto.placement ?? dto.Placement)?.trim() || null;
    }
    if (dto.sequence !== undefined || dto.Sequence !== undefined) {
      const seqVal = dto.sequence ?? dto.Sequence;
      updateData.sequence = seqVal !== null && seqVal !== undefined ? Number(seqVal) : null;
    }
    if (dto.territory !== undefined || dto.Territory !== undefined) {
      updateData.territory = (dto.territory ?? dto.Territory)?.trim() || null;
    }
    if (dto.items !== undefined || dto.Items !== undefined) {
      updateData.items = Array.isArray(dto.items) ? dto.items : (Array.isArray(dto.Items) ? dto.Items : []);
    }
    if (dto.product_id !== undefined || dto.Product_Id !== undefined) {
      updateData.productId = (dto.product_id ?? dto.Product_Id)?.trim() || null;
    }
    if (dto.category_id !== undefined || dto.Category_Id !== undefined) {
      updateData.categoryId = (dto.category_id ?? dto.Category_Id)?.trim() || null;
    }
    if (dto.warehouse_id !== undefined) {
      updateData.warehouseId = dto.warehouse_id?.trim() || null;
    }
    if (dto.redirect_category_id !== undefined) {
      updateData.redirectCategoryId = dto.redirect_category_id?.trim() || null;
    }
    if (dto.redirect_product_id !== undefined) {
      updateData.redirectProductId = dto.redirect_product_id?.trim() || null;
    }
    if (dto.effective_from !== undefined) {
      updateData.effectiveFrom = dto.effective_from ? new Date(dto.effective_from) : null;
    }
    if (dto.effective_to !== undefined) {
      updateData.effectiveTo = dto.effective_to ? new Date(dto.effective_to) : null;
    }
    if (dto.status !== undefined) {
      updateData.status = Boolean(dto.status);
    }
    if (dto.module !== undefined) {
      updateData.module = dto.module?.trim() || null;
    }
    if (dto.created_by !== undefined) {
      updateData.createdBy = dto.created_by?.trim() || null;
    }
    if (dto.updated_by !== undefined) {
      updateData.updatedBy = dto.updated_by?.trim() || null;
    }

    const updated = await this.prisma.dashboard.update({
      where: { widgetId: trimmedId },
      data: updateData,
    });

    this.clearCache();

    return {
      success: true,
      data: this.formatWidget(updated),
      message: 'Dashboard widget updated successfully.',
    };
  }

  /**
   * Deletes a dashboard widget by widget_id.
   * Throws 404 NotFoundException if not found.
   */
  async deleteWidget(widgetId: string): Promise<{ success: boolean; message: string }> {
    const trimmedId = widgetId.trim();
    const existing = await this.prisma.dashboard.findUnique({
      where: { widgetId: trimmedId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Dashboard widget with widget_id '${trimmedId}' was not found.`,
      );
    }

    await this.prisma.dashboard.delete({
      where: { widgetId: trimmedId },
    });

    this.clearCache();

    return {
      success: true,
      message: `Dashboard widget with widget_id '${trimmedId}' was deleted successfully.`,
    };
  }
}
