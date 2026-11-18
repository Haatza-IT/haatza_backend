import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DashboardResolverService } from './dashboard-resolver.service';
import type {
  CreateDashboardDto,
  UpdateDashboardDto,
  DashboardQueryDto,
  DashboardResponse,
  DashboardListResponse,
  DashboardWidget,
  CustomerDashboardResponse,
  ResolvedWidget,
} from './dashboard.types';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 30000; // 30 seconds

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(DashboardResolverService)
    private readonly resolver: DashboardResolverService,
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
   * Customer Dashboard: Fetches active widgets for the requested module (SHOPPING or LITE),
   * sorted by sequence, and populates live product, category, and banner items.
   */
  async getCustomerDashboard(query: DashboardQueryDto): Promise<CustomerDashboardResponse> {
    const rawModule = (query.module || '').trim();
    if (!rawModule) {
      throw new BadRequestException(
        "The 'module' query parameter is required. Allowed values: 'SHOPPING', 'LITE'.",
      );
    }

    const normalizedModule = rawModule.toUpperCase();
    if (normalizedModule !== 'SHOPPING' && normalizedModule !== 'LITE') {
      throw new BadRequestException(
        `Invalid module '${rawModule}'. Allowed values: 'SHOPPING', 'LITE'.`,
      );
    }

    const placementFilter = (query.placement || 'HOME').trim().toUpperCase();
    const territoryFilter = (query.territory || 'ALL').trim().toUpperCase();
    const warehouseIdFilter = query.warehouse_id?.trim() || null;

    const cacheKey = `customer_dashboard:${normalizedModule}:${placementFilter}:${territoryFilter}:${warehouseIdFilter || 'any'}`;
    const cached = this.getFromCache<CustomerDashboardResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Ensure default widget configurations exist in database if count is 0
    await this.ensureDefaultWidgets(normalizedModule);

    // Build filter for active, currently-effective widgets
    const now = new Date();
    const where: any = {
      module: { equals: normalizedModule, mode: 'insensitive' },
      status: true,
      AND: [
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
      ],
    };

    if (placementFilter && placementFilter !== 'ALL') {
      where.OR = [
        { placement: null },
        { placement: { equals: placementFilter, mode: 'insensitive' } },
      ];
    }

    if (territoryFilter && territoryFilter !== 'ALL') {
      where.territory = { in: [territoryFilter, 'ALL'] };
    }

    if (warehouseIdFilter) {
      where.OR = [
        { warehouseId: null },
        { warehouseId: warehouseIdFilter },
      ];
    }

    // Fetch configured widgets from database ordered by sequence
    const widgetRecords = await this.prisma.dashboard.findMany({
      where,
      orderBy: [{ sequence: 'asc' }, { createdAt: 'asc' }],
    });

    // Resolve live items for each widget via DashboardResolverService
    const resolvedWidgets: ResolvedWidget[] = await Promise.all(
      widgetRecords.map((widgetRecord) =>
        this.resolver.resolveWidget(widgetRecord, {
          territory: territoryFilter,
          warehouse_id: warehouseIdFilter || undefined,
        }),
      ),
    );

    const response: CustomerDashboardResponse = {
      success: true,
      module: normalizedModule as 'SHOPPING' | 'LITE',
      placement: placementFilter,
      territory: territoryFilter,
      total_widgets: resolvedWidgets.length,
      widgets: resolvedWidgets,
      data: resolvedWidgets, // dual-property compatibility
    };

    this.setInCache(cacheKey, response);
    return response;
  }

  /**
   * Automatically initializes default widget configurations if none exist for the module.
   */
  async ensureDefaultWidgets(moduleName?: string): Promise<void> {
    const modules = moduleName ? [moduleName.toUpperCase()] : ['SHOPPING', 'LITE'];

    for (const mod of modules) {
      const count = await this.prisma.dashboard.count({
        where: { module: { equals: mod, mode: 'insensitive' } },
      });

      if (count === 0) {
        this.logger.log(`No dashboard widgets found for module '${mod}'. Seeding default widgets...`);
        await this.seedDefaultWidgets(mod);
      }
    }
  }

  /**
   * Seeds the 16 Shopping widgets or 7 Lite widgets into the PostgreSQL dashboard table.
   */
  async seedDefaultWidgets(targetModule?: string): Promise<number> {
    const shoppingWidgets = [
      {
        widgetId: '10000000-0000-4000-8000-000000000001',
        widgetName: 'Hero Banner',
        widgetRedirectTo: '/offers/festive-sale',
        placement: 'HOME',
        sequence: 1,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Hero Banner', 'SHOPPING'),
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000002',
        widgetName: 'Offers Banner',
        widgetRedirectTo: '/offers',
        placement: 'HOME',
        sequence: 2,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Offers Banner', 'SHOPPING'),
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000003',
        widgetName: 'Top Categories',
        widgetRedirectTo: '/categories',
        placement: 'HOME',
        sequence: 3,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000004',
        widgetName: 'Suggested for You',
        widgetRedirectTo: '/recommendations',
        placement: 'HOME',
        sequence: 4,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000005',
        widgetName: 'Promo Banners',
        widgetRedirectTo: '/promotions',
        placement: 'HOME',
        sequence: 5,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Promo Banners', 'SHOPPING'),
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000006',
        widgetName: 'Liked By You',
        widgetRedirectTo: '/wishlist',
        placement: 'HOME',
        sequence: 6,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000007',
        widgetName: 'Recently Viewed By You',
        widgetRedirectTo: '/history',
        placement: 'HOME',
        sequence: 7,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000008',
        widgetName: 'Banner for 49rs, trending fashion, best seller favourites and big deals',
        widgetRedirectTo: '/promotions/combo',
        placement: 'HOME',
        sequence: 8,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Banner for 49rs, trending fashion, best seller favourites and big deals', 'SHOPPING'),
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000009',
        widgetName: 'Trending Fashion',
        widgetRedirectTo: '/categories/fashion',
        placement: 'HOME',
        sequence: 9,
        territory: 'ALL',
        module: 'SHOPPING',
        categoryId: 'f0000000-0000-4000-8000-000000000001',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000010',
        widgetName: 'Deals of the Day',
        widgetRedirectTo: '/deals',
        placement: 'HOME',
        sequence: 10,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000011',
        widgetName: '49rs banner',
        widgetRedirectTo: '/store/49',
        placement: 'HOME',
        sequence: 11,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('49rs banner', 'SHOPPING'),
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000012',
        widgetName: '₹49 Store',
        widgetRedirectTo: '/store/49',
        placement: 'HOME',
        sequence: 12,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000013',
        widgetName: 'Hurry! Deals Ending Soon',
        widgetRedirectTo: '/deals/ending-soon',
        placement: 'HOME',
        sequence: 13,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000014',
        widgetName: 'Best Seller Favourites',
        widgetRedirectTo: '/bestsellers',
        placement: 'HOME',
        sequence: 14,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000015',
        widgetName: 'Fresh New Arrivals',
        widgetRedirectTo: '/new-arrivals',
        placement: 'HOME',
        sequence: 15,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
      {
        widgetId: '10000000-0000-4000-8000-000000000016',
        widgetName: 'More to Explore',
        widgetRedirectTo: '/explore',
        placement: 'HOME',
        sequence: 16,
        territory: 'ALL',
        module: 'SHOPPING',
        status: true,
        items: [],
      },
    ];

    const liteWidgets = [
      {
        widgetId: '20000000-0000-4000-8000-000000000001',
        widgetName: 'Hero Banner',
        widgetRedirectTo: '/lite/offers',
        placement: 'HOME',
        sequence: 1,
        territory: 'ALL',
        module: 'LITE',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Hero Banner', 'LITE'),
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000002',
        widgetName: 'Everyday Essentials',
        widgetRedirectTo: '/lite/category/grocery',
        placement: 'HOME',
        sequence: 2,
        territory: 'ALL',
        module: 'LITE',
        categoryId: 'g0000000-0000-4000-8000-000000000004',
        status: true,
        items: [],
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000003',
        widgetName: 'Live Automated Dispatch Belt',
        widgetRedirectTo: '/lite/live-dispatch',
        placement: 'HOME',
        sequence: 3,
        territory: 'ALL',
        module: 'LITE',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Live Automated Dispatch Belt', 'LITE'),
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000004',
        widgetName: 'Promo Banner',
        widgetRedirectTo: '/lite/promotions',
        placement: 'HOME',
        sequence: 4,
        territory: 'ALL',
        module: 'LITE',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Promo Banner', 'LITE'),
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000005',
        widgetName: 'Offer Banner',
        widgetRedirectTo: '/lite/offers',
        placement: 'HOME',
        sequence: 5,
        territory: 'ALL',
        module: 'LITE',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Offer Banner', 'LITE'),
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000006',
        widgetName: 'Fresh Fruits and Daily Greens',
        widgetRedirectTo: '/lite/category/fruits-greens',
        placement: 'HOME',
        sequence: 6,
        territory: 'ALL',
        module: 'LITE',
        categoryId: 'g0000000-0000-4000-8000-000000000004',
        status: true,
        items: [],
      },
      {
        widgetId: '20000000-0000-4000-8000-000000000007',
        widgetName: 'Household Cleaning and Hygiene',
        widgetRedirectTo: '/lite/category/cleaning',
        placement: 'HOME',
        sequence: 7,
        territory: 'ALL',
        module: 'LITE',
        status: true,
        items: [],
      },
    ];

    let widgetsToSeed: any[] = [];
    const normalizedMod = targetModule?.toUpperCase();

    if (normalizedMod === 'SHOPPING') {
      widgetsToSeed = shoppingWidgets;
    } else if (normalizedMod === 'LITE') {
      widgetsToSeed = liteWidgets;
    } else {
      widgetsToSeed = [...shoppingWidgets, ...liteWidgets];
    }

    let insertedCount = 0;
    const now = new Date();

    for (const w of widgetsToSeed) {
      await this.prisma.dashboard.upsert({
        where: { widgetId: w.widgetId },
        create: {
          widgetId: w.widgetId,
          widgetName: w.widgetName,
          widgetRedirectTo: w.widgetRedirectTo,
          placement: w.placement,
          sequence: w.sequence,
          territory: w.territory,
          module: w.module,
          items: w.items,
          categoryId: w.categoryId ?? null,
          productId: null,
          warehouseId: null,
          redirectCategoryId: null,
          redirectProductId: null,
          effectiveFrom: now,
          effectiveTo: null,
          status: w.status,
          createdBy: 'SYSTEM_INIT',
          updatedBy: 'SYSTEM_INIT',
        },
        update: {
          widgetName: w.widgetName,
          sequence: w.sequence,
          module: w.module,
          placement: w.placement,
          status: w.status,
        },
      });
      insertedCount++;
    }

    this.clearCache();
    this.logger.log(`Seeded/updated ${insertedCount} widgets into dashboard table.`);
    return insertedCount;
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
