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
import { resolveTerritory, isTerritoryMatch } from './territory.util';
import { sanitizeNulls } from '../../common/utils/null-sanitizer.util';
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

/**
 * Perpetual expiry date representations for widgets that never expire.
 * Stored as '2099-12-31 23:59:59+00'::timestamptz in PostgreSQL; serialized as '' in API responses.
 */
export const PERPETUAL_EXPIRY_ISO = '2099-12-31T23:59:59.000Z';
export const PERPETUAL_EXPIRY_DATE = new Date(PERPETUAL_EXPIRY_ISO);

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
   * Returns exact 18 fields in standard contract with guaranteed non-null types.
   * Perpetual expiry sentinel (2099-12-31T23:59:59.000Z) is serialized as '' (empty string).
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
      placement: String(record.placement ?? 'HOME'),
      sequence: record.sequence !== null && record.sequence !== undefined ? Number(record.sequence) : 0,
      territory: String(record.territory ?? 'ALL'),
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
   * Customer Dashboard: Fetches active widgets for the requested module (HAATZA, SHOPPING, or LITE),
   * sorted by sequence, and populates widgets purely from items JSONB in the dashboard table.
   * Zero external queries to Product, Category, or Wishlist tables.
   */
  async getCustomerDashboard(query: DashboardQueryDto): Promise<CustomerDashboardResponse> {
    const rawModule = (query.module || '').trim();
    if (!rawModule) {
      throw new BadRequestException(
        "The 'module' query parameter is required. Allowed values: 'HAATZA', 'SHOPPING', 'LITE'.",
      );
    }

    const upperModule = rawModule.toUpperCase();
    if (upperModule === 'SHOPPING') {
      throw new BadRequestException(
        "The 'SHOPPING' module is no longer supported. Please use module='HAATZA' for HAATZA Shopping.",
      );
    }

    if (upperModule !== 'HAATZA' && upperModule !== 'LITE') {
      throw new BadRequestException(
        `Invalid module '${rawModule}'. Supported values are 'HAATZA' and 'LITE'.`,
      );
    }

    const responseModule = upperModule;
    const dbModules = [upperModule];

    const placementFilter = (query.placement || 'HOME').trim().toUpperCase();
    const territoryFilter = (query.territory || '').trim();
    const warehouseIdFilter = (query.warehouseId || query.warehouse_id || '').trim();
    const categoryIdFilter = (query.categoryId || query.category_id || '').trim();

    // Territory validation: validate against the 28 states of India
    if (territoryFilter && territoryFilter !== 'ALL') {
      const resolved = resolveTerritory(territoryFilter);
      if (!resolved) {
        throw new BadRequestException(
          `Invalid territory prefix '${territoryFilter}'. Territory must be a valid PIN-code prefix for one of the 28 states of India.`,
        );
      }
    }

    const cacheKey = `customer_dashboard:${responseModule}:${placementFilter}:${territoryFilter || 'ALL'}:${warehouseIdFilter || 'any'}:${categoryIdFilter || 'all'}`;
    const cached = this.getFromCache<CustomerDashboardResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Ensure default widget configurations exist in database if count is 0
    await this.ensureDefaultWidgets(upperModule);

    // Build filter for active, currently-effective widgets
    const now = new Date();
    const where: any = {
      module: { equals: upperModule, mode: 'insensitive' },
      status: true,
      effectiveFrom: { lte: now },
      effectiveTo: { gte: now },
    };

    if (placementFilter && placementFilter !== 'ALL') {
      where.placement = { in: [placementFilter, 'HOME', 'ALL', ''] };
    }

    if (territoryFilter && territoryFilter !== 'ALL') {
      // 2-digit location prefix (e.g. '56' for Bengaluru territory) or 'ALL'
      where.territory = { in: [territoryFilter, 'ALL', ''] };
    }

    if (warehouseIdFilter) {
      where.warehouseId = { in: [warehouseIdFilter, 'ALL', ''] };
    }

    // Fetch configured widgets from database ordered by sequence
    const widgetRecords = await this.prisma.dashboard.findMany({
      where,
      orderBy: [{ sequence: 'asc' }, { createdAt: 'asc' }],
    });

    // Resolve widget data purely in-memory from the items JSONB column
    let resolvedWidgets: ResolvedWidget[] = widgetRecords.map((widgetRecord) =>
      this.resolver.resolveWidget(widgetRecord, {
        categoryId: categoryIdFilter,
        territory: territoryFilter,
        warehouseId: warehouseIdFilter,
      }),
    );

    // If categoryId filter is provided, filter widgets while preserving layout structure:
    // 1. BANNER widgets are layout-level promotional sections and must never be removed.
    // 2. If a widget is explicitly dedicated to a different category, exclude it.
    // 3. CATEGORY and PRODUCT_LIST widgets are preserved in the layout sequence even if their items array is empty.
    if (categoryIdFilter) {
      resolvedWidgets = resolvedWidgets.filter((w) => {
        if (w.widget_type === 'BANNER') return true;
        if (w.category_id && w.category_id !== categoryIdFilter) return false;
        return true;
      });
    }

    // Deterministic ascending sequence ordering: strictly by sequence number ASC
    resolvedWidgets.sort((a, b) => a.sequence - b.sequence);

    const response: CustomerDashboardResponse = {
      success: true,
      module: responseModule,
      placement: placementFilter,
      territory: territoryFilter || 'ALL',
      warehouseId: warehouseIdFilter,
      total_widgets: resolvedWidgets.length,
      data: resolvedWidgets,
      widgets: resolvedWidgets,
    };

    const sanitized = sanitizeNulls(response);
    sanitized.widgets = sanitized.data;
    this.setInCache(cacheKey, sanitized);
    return sanitized;
  }

  /**
   * Automatically initializes default widget configurations if none exist for the module.
   */
  async ensureDefaultWidgets(moduleName?: string): Promise<void> {
    const raw = (moduleName || '').toUpperCase();
    const modulesToCheck = raw === 'HAATZA' ? ['HAATZA'] : raw === 'LITE' ? ['LITE'] : ['HAATZA', 'LITE'];

    for (const mod of modulesToCheck) {
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
        widgetId: 'W001',
        widgetName: 'Hero Banner',
        widgetRedirectTo: '/offers/festive-sale',
        placement: 'HOME',
        sequence: 1,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Hero Banner', 'HAATZA'),
      },
      {
        widgetId: 'W002',
        widgetName: 'Offers Banner',
        widgetRedirectTo: '/offers',
        placement: 'HOME',
        sequence: 2,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Offers Banner', 'HAATZA'),
      },
      {
        widgetId: 'W003',
        widgetName: 'Top Categories',
        widgetRedirectTo: '/categories',
        placement: 'HOME',
        sequence: 3,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W004',
        widgetName: 'Suggested for You',
        widgetRedirectTo: '/recommendations',
        placement: 'HOME',
        sequence: 4,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W005',
        widgetName: 'Promo Banners',
        widgetRedirectTo: '/promotions',
        placement: 'HOME',
        sequence: 5,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Promo Banners', 'HAATZA'),
      },
      {
        widgetId: 'W006',
        widgetName: 'Liked By You',
        widgetRedirectTo: '/wishlist',
        placement: 'HOME',
        sequence: 6,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W007',
        widgetName: 'Recently Viewed By You',
        widgetRedirectTo: '/history',
        placement: 'HOME',
        sequence: 7,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W008',
        widgetName: 'Banner for 49rs, trending fashion, best seller favourites and big deals',
        widgetRedirectTo: '/promotions/combo',
        placement: 'HOME',
        sequence: 8,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('Banner for 49rs, trending fashion, best seller favourites and big deals', 'HAATZA'),
      },
      {
        widgetId: 'W009',
        widgetName: 'Trending Fashion',
        widgetRedirectTo: '/categories/fashion',
        placement: 'HOME',
        sequence: 9,
        territory: 'ALL',
        module: 'HAATZA',
        categoryId: 'f0000000-0000-4000-8000-000000000001',
        status: true,
        items: [],
      },
      {
        widgetId: 'W010',
        widgetName: 'Deals of the Day',
        widgetRedirectTo: '/deals',
        placement: 'HOME',
        sequence: 10,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W011',
        widgetName: '49rs banner',
        widgetRedirectTo: '/store/49',
        placement: 'HOME',
        sequence: 11,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: this.resolver.getDefaultBannersForWidget('49rs banner', 'HAATZA'),
      },
      {
        widgetId: 'W012',
        widgetName: '₹49 Store',
        widgetRedirectTo: '/store/49',
        placement: 'HOME',
        sequence: 12,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W013',
        widgetName: 'Hurry! Deals Ending Soon',
        widgetRedirectTo: '/deals/ending-soon',
        placement: 'HOME',
        sequence: 13,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W014',
        widgetName: 'Best Seller Favourites',
        widgetRedirectTo: '/bestsellers',
        placement: 'HOME',
        sequence: 14,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W015',
        widgetName: 'Fresh New Arrivals',
        widgetRedirectTo: '/new-arrivals',
        placement: 'HOME',
        sequence: 15,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
      {
        widgetId: 'W016',
        widgetName: 'More to Explore',
        widgetRedirectTo: '/explore',
        placement: 'HOME',
        sequence: 16,
        territory: 'ALL',
        module: 'HAATZA',
        status: true,
        items: [],
      },
    ];

    const liteWidgets = [
      {
        widgetId: 'W017',
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
        widgetId: 'W018',
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
        widgetId: 'W019',
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
        widgetId: 'W020',
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
        widgetId: 'W021',
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
        widgetId: 'W022',
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
        widgetId: 'W023',
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

    if (normalizedMod === 'HAATZA' || normalizedMod === 'SHOPPING') {
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
          widgetRedirectTo: w.widgetRedirectTo ?? '',
          placement: w.placement || 'HOME',
          sequence: w.sequence,
          territory: w.territory || 'ALL',
          module: w.module,
          items: w.items,
          categoryId: w.categoryId ?? '',
          productId: '',
          warehouseId: '',
          redirectCategoryId: '',
          redirectProductId: '',
          effectiveFrom: now,
          effectiveTo: PERPETUAL_EXPIRY_DATE,
          status: w.status,
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
        },
        update: {
          widgetName: w.widgetName,
          sequence: w.sequence,
          module: w.module,
          placement: w.placement || 'HOME',
          status: w.status,
          updatedBy: 'SYSTEM',
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
        widgetRedirectTo: (dto.widget_redirect_to ?? dto.Redirected_to)?.trim() || '',
        placement: (dto.placement ?? dto.Placement)?.trim() || 'HOME',
        sequence: dto.sequence !== undefined && dto.sequence !== null ? Number(dto.sequence) : (dto.Sequence !== undefined && dto.Sequence !== null ? Number(dto.Sequence) : 0),
        territory: (dto.territory ?? dto.Territory)?.trim() || 'ALL',
        items: Array.isArray(dto.items) ? dto.items : (Array.isArray(dto.Items) ? dto.Items : []),
        productId: (dto.product_id ?? dto.Product_Id)?.trim() || '',
        categoryId: (dto.category_id ?? dto.Category_Id)?.trim() || '',
        warehouseId: dto.warehouse_id?.trim() || '',
        redirectCategoryId: dto.redirect_category_id?.trim() || '',
        redirectProductId: dto.redirect_product_id?.trim() || '',
        effectiveFrom: dto.effective_from ? new Date(dto.effective_from) : new Date(),
        effectiveTo: dto.effective_to ? new Date(dto.effective_to) : PERPETUAL_EXPIRY_DATE,
        status: dto.status !== undefined ? Boolean(dto.status) : true,
        module: (dto.module?.trim() || 'HAATZA').toUpperCase(),
        createdBy: dto.created_by?.trim() || 'SYSTEM',
        updatedBy: dto.updated_by?.trim() || 'SYSTEM',
      },
    });

    this.clearCache();

    const response: DashboardResponse = {
      success: true,
      data: this.formatWidget(created),
      message: 'Dashboard widget created successfully.',
    };

    return sanitizeNulls(response);
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
    const limit = query.limit && query.limit > 0 ? Math.min(Number(query.limit), 100) : 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.module) {
      const upper = query.module.toUpperCase();
      if (upper === 'HAATZA' || upper === 'SHOPPING') {
        where.module = { in: ['HAATZA', 'SHOPPING'], mode: 'insensitive' };
      } else {
        where.module = { equals: query.module, mode: 'insensitive' };
      }
    }
    if (query.placement) {
      where.placement = { equals: query.placement, mode: 'insensitive' };
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
    if (query.status !== undefined) {
      where.status = { equals: Boolean(query.status) };
    }

    // Active-only campaign filter: status is true and current time falls within effective range
    if (query.active_only) {
      const now = new Date();
      where.status = true;
      where.effectiveFrom = { lte: now };
      where.effectiveTo = { gte: now };
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
        orderBy: [{ module: 'asc' }, { sequence: 'asc' }, { widgetId: 'asc' }],
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

    const sanitized = sanitizeNulls(response);
    this.setInCache(cacheKey, sanitized);
    return sanitized;
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

    const sanitized = sanitizeNulls(response);
    this.setInCache(cacheKey, sanitized);
    return sanitized;
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
      updateData.widgetRedirectTo = (dto.widget_redirect_to ?? dto.Redirected_to)?.trim() || '';
    }
    if (dto.placement !== undefined || dto.Placement !== undefined) {
      updateData.placement = (dto.placement ?? dto.Placement)?.trim() || 'HOME';
    }
    if (dto.sequence !== undefined || dto.Sequence !== undefined) {
      const seqVal = dto.sequence ?? dto.Sequence;
      updateData.sequence = seqVal !== null && seqVal !== undefined ? Number(seqVal) : 0;
    }
    if (dto.territory !== undefined || dto.Territory !== undefined) {
      updateData.territory = (dto.territory ?? dto.Territory)?.trim() || 'ALL';
    }
    if (dto.items !== undefined || dto.Items !== undefined) {
      updateData.items = Array.isArray(dto.items) ? dto.items : (Array.isArray(dto.Items) ? dto.Items : []);
    }
    if (dto.product_id !== undefined || dto.Product_Id !== undefined) {
      updateData.productId = (dto.product_id ?? dto.Product_Id)?.trim() || '';
    }
    if (dto.category_id !== undefined || dto.Category_Id !== undefined) {
      updateData.categoryId = (dto.category_id ?? dto.Category_Id)?.trim() || '';
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
      updateData.effectiveFrom = dto.effective_from ? new Date(dto.effective_from) : new Date();
    }
    if (dto.effective_to !== undefined) {
      updateData.effectiveTo = dto.effective_to ? new Date(dto.effective_to) : PERPETUAL_EXPIRY_DATE;
    }
    if (dto.status !== undefined) {
      updateData.status = Boolean(dto.status);
    }
    if (dto.module !== undefined) {
      updateData.module = dto.module?.trim() ? dto.module.trim().toUpperCase() : existing.module;
    }
    if (dto.created_by !== undefined) {
      updateData.createdBy = dto.created_by?.trim() || 'SYSTEM';
    }
    if (dto.updated_by !== undefined) {
      updateData.updatedBy = dto.updated_by?.trim() || 'SYSTEM';
    }

    const updated = await this.prisma.dashboard.update({
      where: { widgetId: trimmedId },
      data: updateData,
    });

    this.clearCache();

    const response: DashboardResponse = {
      success: true,
      data: this.formatWidget(updated),
      message: 'Dashboard widget updated successfully.',
    };

    return sanitizeNulls(response);
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
