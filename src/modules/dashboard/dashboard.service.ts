import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DashboardCacheService } from './dashboard-cache.service';
import { formatDashboardResponse } from './dashboard-formatter.util';
import { sanitizeNulls } from '../../common/utils/null-sanitizer.util';
import type {
  CreateDashboardDto,
  UpdateDashboardDto,
  DashboardQueryDto,
  DashboardResponse,
  DashboardListResponse,
  DashboardWidget,
  CustomerDashboardResponse,
} from './dashboard.types';

export const PERPETUAL_EXPIRY_ISO = '2099-12-31T23:59:59.000Z';
export const PERPETUAL_EXPIRY_DATE = new Date(PERPETUAL_EXPIRY_ISO);

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(DashboardCacheService)
    private readonly cacheService: DashboardCacheService,
  ) {}

  /**
   * Helper to format a database Dashboard record for Admin/CMS API responses.
   */
  private formatWidget(record: any): DashboardWidget {
    const rawItems = Array.isArray(record.items) ? record.items : [];
    const sanitizedItems = sanitizeNulls(rawItems);
    const effectiveFromIso = record.effectiveFrom ? new Date(record.effectiveFrom).toISOString() : '';
    const effectiveToIso = record.effectiveTo ? new Date(record.effectiveTo).toISOString() : '';
    const effective_to = effectiveToIso === PERPETUAL_EXPIRY_ISO ? '' : effectiveToIso;

    return {
      widget_id: String(record.widgetId ?? record.widget_id ?? ''),
      widget_name: String(record.widgetName ?? record.widget_name ?? ''),
      widget_redirect_to: String(record.widgetRedirectTo ?? record.widget_redirect_to ?? ''),
      placement: String(record.placement ?? 'DESKTOP'),
      sequence: record.sequence !== null && record.sequence !== undefined ? Number(record.sequence) : 0,
      territory: String(record.territory ?? '56'),
      items: sanitizedItems,
      product_id: String(record.productId ?? record.product_id ?? ''),
      category_id: String(record.categoryId ?? record.category_id ?? ''),
      warehouse_id: String(record.warehouseId ?? record.warehouse_id ?? ''),
      redirect_category_id: String(record.redirectCategoryId ?? record.redirect_category_id ?? ''),
      redirect_product_id: String(record.redirectProductId ?? record.redirect_product_id ?? ''),
      effective_from: effectiveFromIso,
      effective_to,
      status: record.status !== undefined ? Boolean(record.status) : true,
      module: String(record.module ?? 'HAATZA'),
      created_by: String(record.createdBy ?? record.created_by ?? ''),
      updated_by: String(record.updatedBy ?? record.updated_by ?? ''),
      created_at: record.createdAt ? new Date(record.createdAt).toISOString() : '',
      updated_at: record.updatedAt ? new Date(record.updatedAt).toISOString() : '',
    };
  }

  /**
   * Clears the entire dashboard in-memory cache
   */
  public clearCache(): void {
    this.cacheService.clearAll();
  }

  /**
   * Customer Dashboard: Fetches active widgets for the requested module (HAATZA or LITE),
   * sorted by sequence, and populates widgets purely from items JSONB in the dashboard table.
   * Zero external queries to Product, Category, or other tables.
   */
  async getCustomerDashboard(query: DashboardQueryDto): Promise<CustomerDashboardResponse> {
    // 1. Validate request parameters before cache and before database
    const rawModule = (query.module || '').trim().toUpperCase();
    if (rawModule !== 'HAATZA' && rawModule !== 'LITE') {
      throw new BadRequestException(`module must be either 'HAATZA' or 'LITE'. Received: '${query.module}'`);
    }

    const categoryId = (query.categoryId || (query as any).category_id || '').trim();
    if (!categoryId) {
      throw new BadRequestException('categoryId is required and must not be empty');
    }

    const territory = (query.territory || '').trim();
    if (!territory || !/^\d{2}$/.test(territory)) {
      throw new BadRequestException(`territory is required and must be exactly 2 digits. Received: '${territory}'`);
    }

    const rawPlacement = (query.placement || '').trim().toUpperCase();
    if (!rawPlacement || (rawPlacement !== 'DESKTOP' && rawPlacement !== 'MOBILE')) {
      throw new BadRequestException(
        `placement is required and must be either 'DESKTOP' or 'MOBILE'. Received: '${query.placement}'`,
      );
    }

    const warehouseId = (query.warehouseId || (query as any).warehouse_id || '').trim();
    if (rawModule === 'LITE' && !warehouseId) {
      throw new BadRequestException('warehouseId is required for LITE module');
    }

    // 2. Build cache key
    const cacheKey = this.cacheService.buildKey(
      rawModule,
      rawPlacement,
      categoryId,
      territory,
      warehouseId,
    );

    // 3. Query via cache loader with in-flight deduplication
    return this.cacheService.getOrSet(cacheKey, async () => {
      // Calculate today's full range in India Standard Time (IST, UTC+05:30)
      const now = new Date();
      const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
      const istMillis = utcMillis + 5.5 * 3600000;
      const istDate = new Date(istMillis);

      const startOfTodayIst = new Date(
        Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 0, 0, 0, 0) -
          5.5 * 3600000,
      );
      const endOfTodayIst = new Date(
        Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 23, 59, 59, 999) -
          5.5 * 3600000,
      );

      // Build database query filter:
      // 1. category_id equals requested categoryId
      // 2. module equals requested module
      // 3. territory equals requested territory
      // 4. placement equals requested placement (DESKTOP or MOBILE)
      // 5. LITE only: warehouse_id equals requested warehouseId
      // 6. status = true
      // 7. Today (IST) is between effective_from and effective_to. The last day counts fully.
      const where: any = {
        module: { equals: rawModule, mode: 'insensitive' },
        categoryId: { equals: categoryId },
        territory: { equals: territory },
        placement: { equals: rawPlacement },
        status: true,
        effectiveFrom: { lte: endOfTodayIst },
        effectiveTo: { gte: startOfTodayIst },
      };

      if (rawModule === 'LITE') {
        where.warehouseId = { equals: warehouseId };
      }

      const records = await this.prisma.dashboard.findMany({
        where,
        orderBy: [{ sequence: 'asc' }, { widgetId: 'asc' }],
      });

      // Format response with default values and clean envelope
      return formatDashboardResponse(rawModule, categoryId, territory, records, warehouseId);
    });
  }

  /**
   * Creates a new Dashboard widget.
   */
  async createWidget(dto: CreateDashboardDto): Promise<DashboardResponse> {
    const widgetId = (dto.widget_id || (dto as any).Widget_id || '').trim();

    const existing = await this.prisma.dashboard.findUnique({
      where: { widgetId },
    });

    if (existing) {
      throw new ConflictException(
        `Dashboard widget with widget_id '${widgetId}' already exists.`,
      );
    }

    const rawCategoryId = (dto.category_id ?? (dto as any).Category_Id)?.trim() || '';
    const processedItems = Array.isArray(dto.items) ? dto.items : [];

    const created = await this.prisma.dashboard.create({
      data: {
        widgetId,
        widgetName: (dto.widget_name || (dto as any).Widget_name || '').trim(),
        widgetRedirectTo: (dto.widget_redirect_to ?? (dto as any).Redirected_to)?.trim() || '',
        placement: (dto.placement ?? (dto as any).Placement)?.trim() || 'DESKTOP',
        sequence: dto.sequence !== undefined && dto.sequence !== null ? Number(dto.sequence) : 0,
        territory: (dto.territory ?? (dto as any).Territory)?.trim() || '56',
        items: processedItems,
        productId: (dto.product_id ?? (dto as any).Product_Id)?.trim() || '',
        categoryId: rawCategoryId,
        warehouseId: dto.warehouse_id?.trim() || '',
        redirectCategoryId: dto.redirect_category_id?.trim() || '',
        redirectProductId: dto.redirect_product_id?.trim() || '',
        effectiveFrom: dto.effective_from ? new Date(dto.effective_from) : new Date(),
        effectiveTo: dto.effective_to ? new Date(dto.effective_to) : PERPETUAL_EXPIRY_DATE,
        status: dto.status !== undefined ? Boolean(dto.status) : true,
        module: (dto.module?.trim() || 'HAATZA').toUpperCase(),
        createdBy: dto.created_by?.trim() || 'admin1',
        updatedBy: dto.updated_by?.trim() || 'admin1',
      },
    });

    this.cacheService.clearAll();

    return {
      success: true,
      data: this.formatWidget(created),
    };
  }

  /**
   * Lists dashboard widgets for Admin/CMS (raw query).
   */
  async findAllWidgets(query: any): Promise<DashboardListResponse> {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(Number(query.limit), 100) : 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.module) {
      where.module = { equals: query.module, mode: 'insensitive' };
    }
    if (query.territory) {
      where.territory = { equals: query.territory, mode: 'insensitive' };
    }
    const warehouseFilter = query.warehouseId || query.warehouse_id;
    if (warehouseFilter) {
      where.warehouseId = { equals: warehouseFilter, mode: 'insensitive' };
    }
    const categoryFilter = query.categoryId || query.category_id;
    if (categoryFilter) {
      where.categoryId = { equals: categoryFilter, mode: 'insensitive' };
    }
    if (query.sequence !== undefined && query.sequence !== null) {
      where.sequence = { equals: Number(query.sequence) };
    }
    if (query.placement) {
      where.placement = { equals: query.placement.trim() };
    }
    if (query.status !== undefined) {
      where.status = { equals: Boolean(query.status) };
    }

    const [total, records] = await Promise.all([
      this.prisma.dashboard.count({ where }),
      this.prisma.dashboard.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { module: 'asc' },
          { categoryId: 'asc' },
          { sequence: 'asc' },
          { widgetId: 'asc' },
        ],
      }),
    ]);

    return {
      success: true,
      data: records.map((record: any) => this.formatWidget(record)),
      count: total,
    };
  }

  /**
   * Retrieves a single dashboard widget by widget_id.
   */
  async findWidgetById(widgetId: string): Promise<DashboardResponse> {
    const trimmedId = widgetId.trim();
    const record = await this.prisma.dashboard.findUnique({
      where: { widgetId: trimmedId },
    });

    if (!record) {
      throw new NotFoundException(
        `Dashboard widget with widget_id '${trimmedId}' was not found.`,
      );
    }

    return {
      success: true,
      data: this.formatWidget(record),
    };
  }

  /**
   * Updates an existing dashboard widget by widget_id.
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

    if (dto.widget_name !== undefined || (dto as any).Widget_name !== undefined) {
      updateData.widgetName = (dto.widget_name ?? (dto as any).Widget_name)?.trim() || existing.widgetName;
    }
    if (dto.widget_redirect_to !== undefined || (dto as any).Redirected_to !== undefined) {
      updateData.widgetRedirectTo = (dto.widget_redirect_to ?? (dto as any).Redirected_to)?.trim() || '';
    }
    if (dto.placement !== undefined || (dto as any).Placement !== undefined) {
      updateData.placement = (dto.placement ?? (dto as any).Placement)?.trim() || existing.placement;
    }
    if (dto.sequence !== undefined || (dto as any).Sequence !== undefined) {
      const seqVal = dto.sequence ?? (dto as any).Sequence;
      updateData.sequence = seqVal !== null && seqVal !== undefined ? Number(seqVal) : 0;
    }
    if (dto.territory !== undefined || (dto as any).Territory !== undefined) {
      updateData.territory = (dto.territory ?? (dto as any).Territory)?.trim() || existing.territory;
    }
    if (dto.items !== undefined || (dto as any).Items !== undefined) {
      updateData.items = Array.isArray(dto.items) ? dto.items : [];
    }
    if (dto.product_id !== undefined || (dto as any).Product_Id !== undefined) {
      updateData.productId = (dto.product_id ?? (dto as any).Product_Id)?.trim() || '';
    }
    if (dto.category_id !== undefined || (dto as any).Category_Id !== undefined) {
      updateData.categoryId = (dto.category_id ?? (dto as any).Category_Id)?.trim() || '';
    }
    if (dto.warehouse_id !== undefined) {
      updateData.warehouseId = dto.warehouse_id?.trim() || '';
    }
    if (dto.redirect_category_id !== undefined) {
      updateData.redirectCategoryId = dto.redirect_category_id?.trim() || '';
    }
    if (dto.redirect_product_id !== undefined) {
      updateData.redirectProductId = dto.redirect_product_id?.trim() || '';
    }
    if (dto.effective_from !== undefined) {
      updateData.effectiveFrom = dto.effective_from ? new Date(dto.effective_from) : existing.effectiveFrom;
    }
    if (dto.effective_to !== undefined) {
      updateData.effectiveTo = dto.effective_to ? new Date(dto.effective_to) : existing.effectiveTo;
    }
    if (dto.status !== undefined) {
      updateData.status = Boolean(dto.status);
    }
    if (dto.module !== undefined) {
      updateData.module = dto.module?.trim() ? dto.module.trim().toUpperCase() : existing.module;
    }
    if (dto.updated_by !== undefined) {
      updateData.updatedBy = dto.updated_by?.trim() || 'admin1';
    }

    const updated = await this.prisma.dashboard.update({
      where: { widgetId: trimmedId },
      data: updateData,
    });

    this.cacheService.clearAll();

    return {
      success: true,
      data: this.formatWidget(updated),
    };
  }

  /**
   * Deletes a dashboard widget by widget_id.
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

    this.cacheService.clearAll();

    return {
      success: true,
      message: `Dashboard widget with widget_id '${trimmedId}' was deleted successfully.`,
    };
  }

  /**
   * Admin Seed: Inserts the 169 HAATZA dashboard rows using ON CONFLICT (widget_id) DO NOTHING.
   * Safe to rerun, never overwrites existing items or legacy rows.
   */
  async seedDashboard(): Promise<{ totalAttempted: number; totalInserted: number }> {
    const { generate169DashboardRows } = await import('./dashboard-seed.util');
    const rows = generate169DashboardRows();
    let totalInserted = 0;

    for (const r of rows) {
      try {
        await this.prisma.$executeRaw`
          INSERT INTO dashboard (
            widget_id, widget_name, widget_redirect_to, placement, sequence,
            territory, items, product_id, category_id, warehouse_id,
            redirect_category_id, redirect_product_id, effective_from, effective_to,
            status, module, created_by, updated_by
          ) VALUES (
            ${r.widget_id}, ${r.widget_name}, ${r.widget_redirect_to}, ${r.placement}, ${r.sequence},
            ${r.territory}, ${JSON.stringify(r.items)}::jsonb, ${r.product_id}, ${r.category_id}, ${r.warehouse_id},
            ${r.redirect_category_id}, ${r.redirect_product_id}, ${new Date(r.effective_from)}, ${new Date(r.effective_to)},
            ${r.status}, ${r.module}, ${r.created_by}, ${r.updated_by}
          )
          ON CONFLICT (widget_id) DO NOTHING;
        `;
        totalInserted++;
      } catch (err: any) {
        this.logger.warn(`Seed row ${r.widget_id} skipped or error: ${err.message}`);
      }
    }

    this.clearCache();
    return {
      totalAttempted: rows.length,
      totalInserted,
    };
  }
}
