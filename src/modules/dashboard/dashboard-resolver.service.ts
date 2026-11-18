import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  ResolvedWidget,
  WidgetType,
  RedirectType,
  BannerItem,
  CategoryItem,
  ProductItem,
} from './dashboard.types';

@Injectable()
export class DashboardResolverService {
  private readonly logger = new Logger(DashboardResolverService.name);

  // Verified Category UUIDs in Neon PostgreSQL
  private readonly FASHION_CAT_ID = 'f0000000-0000-4000-8000-000000000001';
  private readonly ELECTRONICS_CAT_ID = 'e0000000-0000-4000-8000-000000000002';
  private readonly HOME_KITCHEN_CAT_ID = 'h0000000-0000-4000-8000-000000000003';
  private readonly GROCERY_CAT_ID = 'g0000000-0000-4000-8000-000000000004';
  private readonly BEAUTY_CAT_ID = 'b0000000-0000-4000-8000-000000000005';
  private readonly SPORTS_CAT_ID = 's0000000-0000-4000-8000-000000000006';

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Maps module and sequence to standard W001-W023 API identifier without altering database records.
   */
  private mapWidgetId(
    module: string | null | undefined,
    sequence: number | null | undefined,
    fallbackId: string,
  ): string {
    const mod = (module || '').toUpperCase();
    const seq = sequence !== null && sequence !== undefined ? Number(sequence) : 0;

    if (mod === 'SHOPPING' && seq >= 1 && seq <= 16) {
      return `W${String(seq).padStart(3, '0')}`;
    }
    if (mod === 'LITE' && seq >= 1 && seq <= 7) {
      return `W${String(seq + 16).padStart(3, '0')}`;
    }
    return fallbackId;
  }

  /**
   * Infers standard navigation redirect type from destination path.
   */
  private inferRedirectType(redirectUrl: string | null | undefined): RedirectType {
    if (!redirectUrl) return 'CAMPAIGN';
    const url = redirectUrl.toLowerCase().trim();
    if (url.startsWith('/categories') || url.startsWith('/lite/category')) {
      return 'CATEGORY';
    }
    if (url.startsWith('/products') || url.startsWith('/lite/products')) {
      return 'PRODUCT';
    }
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.includes('delivery-info') ||
      url.includes('dispatch-info')
    ) {
      return 'EXTERNAL';
    }
    return 'CAMPAIGN';
  }

  /**
   * Formats a raw banner JSONB item into the standardized BannerItem structure.
   */
  private formatBannerItem(b: any, defaultId: string): BannerItem {
    const redirectUrl = b.redirect_url ?? b.redirectUrl ?? b.link ?? '/offers';
    return {
      id: String(b.id || defaultId),
      title: String(b.title || ''),
      subtitle: b.subtitle ?? null,
      badge: b.badge ?? null,
      image_url: b.image_url ?? b.imageUrl ?? b.image ?? '',
      button_text: b.button_text ?? b.buttonText ?? b.cta_text ?? b.ctaText ?? null,
      redirect_type: this.inferRedirectType(redirectUrl),
      redirect_url: redirectUrl,
    };
  }

  /**
   * Serializes a database product record into the verified ProductItem payload.
   * Excludes unverified stock integers and maintains strict pricing decimals.
   */
  private formatProduct(p: any): ProductItem {
    const isLite = Boolean(p.isHaatzaLite);
    return {
      product_id: p.productId,
      product_name: p.productName,
      product_image: p.productCoverImage ?? null,
      category_id: p.categoryId,
      category_name: p.categoryName ?? p.category?.name ?? null,
      subcategory_id: p.subcategoryId ?? null,
      subcategory_name: p.subcategoryName ?? null,
      brand: p.brand ?? null,
      price: p.price !== null && p.price !== undefined ? Number(p.price) : 0,
      mrp: p.mrp !== null && p.mrp !== undefined ? Number(p.mrp) : null,
      discount: p.discount !== null && p.discount !== undefined ? Number(p.discount) : 0,
      onsale_price: p.onSalePrice !== null && p.onSalePrice !== undefined ? Number(p.onSalePrice) : null,
      ribbon: p.ribbon ?? null,
      is_haatzalite: isLite,
      haatza_verified: Boolean(p.haatzaVerified),
      redirect_type: 'PRODUCT',
      redirect_url: isLite ? `/lite/products/${p.productId}` : `/products/${p.productId}`,
    };
  }

  /**
   * Serializes a database category record into CategoryItem payload.
   */
  private formatCategory(c: any): CategoryItem {
    return {
      category_id: c.id,
      category_name: c.name,
      slug: c.slug,
      category_image: c.image ?? null,
      redirect_type: 'CATEGORY',
      redirect_url: `/categories/${c.slug}`,
    };
  }

  /**
   * Resolves purpose-specific data for a dashboard widget.
   */
  async resolveWidget(
    widget: any,
    options: { territory?: string; warehouse_id?: string } = {},
  ): Promise<ResolvedWidget> {
    const rawName = (widget.widgetName ?? widget.widget_name ?? '').trim();
    const normalizedName = rawName.toLowerCase();
    const mod = (widget.module ?? 'SHOPPING').toUpperCase();
    const seq = widget.sequence !== null && widget.sequence !== undefined ? Number(widget.sequence) : null;
    const originalId = widget.widgetId ?? widget.widget_id;
    const apiWidgetId = this.mapWidgetId(mod, seq, originalId);

    const baseWidget = {
      widget_id: apiWidgetId,
      widget_name: rawName,
      widget_redirect_to: widget.widgetRedirectTo ?? widget.widget_redirect_to ?? null,
      placement: widget.placement ?? 'HOME',
      sequence: seq,
      territory: widget.territory ?? 'ALL',
      module: mod,
      warehouse_id: widget.warehouseId ?? widget.warehouse_id ?? null,
      category_id: widget.categoryId ?? widget.category_id ?? null,
      product_id: widget.productId ?? widget.product_id ?? null,
      redirect_category_id: widget.redirectCategoryId ?? widget.redirect_category_id ?? null,
      redirect_product_id: widget.redirectProductId ?? widget.redirect_product_id ?? null,
      effective_from: widget.effectiveFrom ? new Date(widget.effectiveFrom).toISOString() : null,
      effective_to: widget.effectiveTo ? new Date(widget.effectiveTo).toISOString() : null,
      status: widget.status !== undefined ? Boolean(widget.status) : true,
    };

    // -------------------------------------------------------------
    // 1. PERSONALIZED WIDGETS (Strictly empty items + dependency metadata)
    // -------------------------------------------------------------
    if (normalizedName.includes('suggested for you') || (mod === 'SHOPPING' && seq === 4)) {
      return {
        ...baseWidget,
        widget_type: 'PERSONALIZED',
        items: [],
        total_items: 0,
        dependency_status: 'PENDING_DEPENDENCY',
        dependency_name: 'RECOMMENDATION_ENGINE',
        message: 'Personalized product suggestions will appear once recommendation service is integrated.',
      };
    }

    if (normalizedName.includes('liked by you') || (mod === 'SHOPPING' && seq === 6)) {
      return {
        ...baseWidget,
        widget_type: 'PERSONALIZED',
        items: [],
        total_items: 0,
        dependency_status: 'PENDING_DEPENDENCY',
        dependency_name: 'USER_WISHLIST_SERVICE',
        message: 'Liked products will appear once customer wishlist service is integrated.',
      };
    }

    if (normalizedName.includes('recently viewed') || (mod === 'SHOPPING' && seq === 7)) {
      return {
        ...baseWidget,
        widget_type: 'PERSONALIZED',
        items: [],
        total_items: 0,
        dependency_status: 'PENDING_DEPENDENCY',
        dependency_name: 'BROWSING_HISTORY_TRACKER',
        message: 'Recently viewed items will appear once customer browsing history service is integrated.',
      };
    }

    // -------------------------------------------------------------
    // 2. DISPATCH BELT (Widget 19 / LITE sequence 3)
    // Pure static promotional information - no fake live telemetry
    // -------------------------------------------------------------
    if (normalizedName.includes('dispatch belt') || (mod === 'LITE' && seq === 3)) {
      const items: BannerItem[] = [
        {
          id: 'dispatch-info-1',
          title: 'HAATZA Lite Express Delivery',
          subtitle: 'Fast local delivery for fresh groceries and daily essentials',
          badge: 'HAATZA LITE',
          image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
          button_text: 'Learn More',
          redirect_type: 'EXTERNAL',
          redirect_url: '/lite/delivery-info',
        },
      ];

      return {
        ...baseWidget,
        widget_type: 'BANNER',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 3. BANNER WIDGETS (Hero, Offers, Promo, 49rs banner, Combo banners)
    // Reads authoritatively from database JSONB items; failsafe fallback if empty
    // -------------------------------------------------------------
    const isBannerWidget =
      normalizedName.includes('banner') ||
      normalizedName.includes('hero');

    if (isBannerWidget) {
      const rawItems = Array.isArray(widget.items) && widget.items.length > 0
        ? widget.items
        : this.getDefaultBannersForWidget(rawName, mod);

      const items: BannerItem[] = rawItems.map((item: any, idx: number) =>
        this.formatBannerItem(item, `banner-${mod.toLowerCase()}-${seq || 1}-${idx + 1}`),
      );

      return {
        ...baseWidget,
        widget_type: 'BANNER',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 4. TOP CATEGORIES (SHOPPING sequence 3)
    // Reads directly from active records in Category table
    // -------------------------------------------------------------
    if (normalizedName === 'top categories' || (normalizedName.includes('categor') && !normalizedName.includes('product'))) {
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      const items: CategoryItem[] = categories.map((c) => this.formatCategory(c));

      return {
        ...baseWidget,
        widget_type: 'CATEGORY',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 5. TRENDING FASHION (SHOPPING sequence 9)
    // -------------------------------------------------------------
    if (normalizedName.includes('trending fashion') || (mod === 'SHOPPING' && seq === 9)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          categoryId: this.FASHION_CAT_ID,
        },
        take: 10,
        orderBy: [
          { sales: 'desc' },
          { priorityScore: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 6. DEALS OF THE DAY (SHOPPING sequence 10)
    // -------------------------------------------------------------
    if (normalizedName.includes('deals of the day') || (mod === 'SHOPPING' && seq === 10)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          OR: [
            { discount: { gt: 0 } },
            { onSalePrice: { not: null } },
          ],
        },
        take: 10,
        orderBy: [
          { discount: 'desc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 7. ₹49 STORE (SHOPPING sequence 12)
    // Strictly products <= 49. Returns empty list if none match.
    // -------------------------------------------------------------
    if (normalizedName.includes('49 store') || normalizedName.includes('₹49') || (mod === 'SHOPPING' && seq === 12)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          price: { lte: 49 },
        },
        take: 10,
        orderBy: [
          { discount: 'desc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
        ...(items.length === 0 ? { message: 'No products currently available at or below ₹49.' } : {}),
      };
    }

    // -------------------------------------------------------------
    // 8. HURRY! DEALS ENDING SOON (SHOPPING sequence 13)
    // -------------------------------------------------------------
    if (normalizedName.includes('deals ending soon') || normalizedName.includes('hurry') || (mod === 'SHOPPING' && seq === 13)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          discount: { gte: 20 },
        },
        take: 10,
        orderBy: [
          { discount: 'desc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 9. BEST SELLER FAVOURITES (SHOPPING sequence 14)
    // -------------------------------------------------------------
    if (normalizedName.includes('best seller') || normalizedName.includes('bestseller') || (mod === 'SHOPPING' && seq === 14)) {
      const products = await this.prisma.product.findMany({
        where: { status: true },
        take: 10,
        orderBy: [
          { sales: 'desc' },
          { revenue: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 10. FRESH NEW ARRIVALS (SHOPPING sequence 15)
    // -------------------------------------------------------------
    if (normalizedName.includes('fresh new arrivals') || normalizedName.includes('new arrival') || (mod === 'SHOPPING' && seq === 15)) {
      const products = await this.prisma.product.findMany({
        where: { status: true },
        take: 10,
        orderBy: [
          { priorityScore: 'desc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 11. MORE TO EXPLORE (SHOPPING sequence 16)
    // -------------------------------------------------------------
    if (normalizedName.includes('more to explore') || normalizedName.includes('explore') || (mod === 'SHOPPING' && seq === 16)) {
      const products = await this.prisma.product.findMany({
        where: { status: true },
        take: 12,
        orderBy: [
          { priorityScore: 'asc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 12. EVERYDAY ESSENTIALS (LITE sequence 2)
    // Strictly requires isHaatzaLite: true
    // -------------------------------------------------------------
    if (normalizedName.includes('everyday essentials') || (mod === 'LITE' && seq === 2)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          isHaatzaLite: true,
          categoryId: this.GROCERY_CAT_ID,
        },
        take: 10,
        orderBy: [
          { sales: 'desc' },
          { priorityScore: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
        ...(items.length === 0 ? { message: 'No products currently marked as eligible for HAATZA Lite (isHaatzaLite = true) in Grocery.' } : {}),
      };
    }

    // -------------------------------------------------------------
    // 13. FRESH FRUITS AND DAILY GREENS (LITE sequence 6)
    // Strictly requires isHaatzaLite: true
    // -------------------------------------------------------------
    if (normalizedName.includes('fresh fruits') || normalizedName.includes('daily greens') || (mod === 'LITE' && seq === 6)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          isHaatzaLite: true,
          categoryId: this.GROCERY_CAT_ID,
        },
        take: 10,
        orderBy: [
          { priorityScore: 'desc' },
          { sales: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
        ...(items.length === 0 ? { message: 'No products currently marked as eligible for HAATZA Lite (isHaatzaLite = true) in Fresh Greens.' } : {}),
      };
    }

    // -------------------------------------------------------------
    // 14. HOUSEHOLD CLEANING AND HYGIENE (LITE sequence 7)
    // Strictly requires isHaatzaLite: true
    // -------------------------------------------------------------
    if (normalizedName.includes('cleaning') || normalizedName.includes('hygiene') || (mod === 'LITE' && seq === 7)) {
      const products = await this.prisma.product.findMany({
        where: {
          status: true,
          isHaatzaLite: true,
          categoryId: { in: [this.HOME_KITCHEN_CAT_ID, this.BEAUTY_CAT_ID] },
        },
        take: 10,
        orderBy: [
          { sales: 'desc' },
          { priorityScore: 'desc' },
        ],
      });

      const items: ProductItem[] = products.map((p) => this.formatProduct(p));

      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
        ...(items.length === 0 ? { message: 'No products currently marked as eligible for HAATZA Lite (isHaatzaLite = true) in Cleaning & Hygiene.' } : {}),
      };
    }

    // -------------------------------------------------------------
    // 15. SPECIFIC PRODUCT ASSIGNED (Fallback)
    // -------------------------------------------------------------
    if (widget.productId || widget.product_id) {
      const targetId = widget.productId || widget.product_id;
      const product = await this.prisma.product.findUnique({
        where: { productId: targetId },
      });
      const items: ProductItem[] = product ? [this.formatProduct(product)] : [];
      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 16. SPECIFIC CATEGORY ASSIGNED (Fallback)
    // -------------------------------------------------------------
    if (widget.categoryId || widget.category_id) {
      const targetCatId = widget.categoryId || widget.category_id;
      const products = await this.prisma.product.findMany({
        where: { status: true, categoryId: targetCatId },
        take: 10,
        orderBy: [{ sales: 'desc' }],
      });
      const items: ProductItem[] = products.map((p) => this.formatProduct(p));
      return {
        ...baseWidget,
        widget_type: 'PRODUCT_LIST',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 17. GENERIC / CUSTOM WIDGET (Fallback to items in JSONB)
    // -------------------------------------------------------------
    const rawItems = Array.isArray(widget.items) ? widget.items : [];
    return {
      ...baseWidget,
      widget_type: 'CUSTOM',
      items: rawItems,
      total_items: rawItems.length,
    };
  }

  /**
   * Provides fallback banner items when database items JSONB is empty.
   */
  getDefaultBannersForWidget(widgetName: string, module: string): any[] {
    const isLite = (module ?? '').toUpperCase() === 'LITE';

    if (widgetName.toLowerCase().includes('hero')) {
      return isLite
        ? [
            {
              id: 'lite-hero-1',
              title: 'Groceries Delivered in 10 Minutes',
              subtitle: 'Fresh farm veggies, milk, fruits & daily staples at wholesale prices',
              image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
              redirect_url: '/lite/category/grocery',
              badge: '10 Min Delivery',
              button_text: 'Order Now',
            },
            {
              id: 'lite-hero-2',
              title: 'Morning Breakfast Store',
              subtitle: 'Fresh Bread, Milk, Butter, Eggs & Hot Beverages',
              image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
              redirect_url: '/lite/category/breakfast',
              badge: 'Fresh Daily',
              button_text: 'Shop Essentials',
            },
          ]
        : [
            {
              id: 'shop-hero-1',
              title: 'Big Festive Electronics & Fashion Sale',
              subtitle: 'Up to 70% Off on Top National Brands with Instant Bank Discounts',
              image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
              redirect_url: '/offers/festive-sale',
              badge: 'Mega Sale',
              button_text: 'Explore Deals',
            },
            {
              id: 'shop-hero-2',
              title: 'Trending Winter & Summer Wardrobes',
              subtitle: 'Premium cotton t-shirts, kurtis, jackets & watches from ₹299',
              image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
              redirect_url: '/categories/fashion',
              badge: 'Trending Now',
              button_text: 'Shop Fashion',
            },
          ];
    }

    if (widgetName.toLowerCase().includes('live automated dispatch belt')) {
      return [
        {
          id: 'dispatch-info-1',
          title: 'HAATZA Lite Express Delivery',
          subtitle: 'Fast local delivery for fresh groceries and daily essentials',
          badge: 'HAATZA LITE',
          image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
          button_text: 'Learn More',
          redirect_url: '/lite/delivery-info',
        },
      ];
    }

    if (widgetName.toLowerCase().includes('49rs banner') || widgetName.toLowerCase().includes('49rs, trending')) {
      return [
        {
          id: 'banner-49-combo-1',
          title: 'Under ₹49 Super Budget Corner',
          subtitle: 'Daily essentials, snacks and grooming accessories',
          image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
          redirect_url: '/store/49',
          badge: 'Flat ₹49',
          button_text: 'Shop ₹49',
        },
        {
          id: 'banner-49-combo-2',
          title: 'Trending Fashion & Top Wardrobe Essentials',
          subtitle: 'Exclusive season collections starting at ₹299',
          image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
          redirect_url: '/categories/fashion',
          badge: 'Trending Now',
          button_text: 'Shop Fashion',
        },
        {
          id: 'banner-49-combo-3',
          title: 'Best Seller Favourites',
          subtitle: 'Highest customer rated products of the month',
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          redirect_url: '/bestsellers',
          badge: 'Top Rated',
          button_text: 'Explore Bestsellers',
        },
        {
          id: 'banner-49-combo-4',
          title: 'Big Deals & Clearance',
          subtitle: 'Extra 20% off on clearance items with free delivery',
          image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
          redirect_url: '/deals',
          badge: 'Mega Discount',
          button_text: 'Grab Deals',
        },
      ];
    }

    return [
      {
        id: `banner-${widgetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-1`,
        title: widgetName,
        subtitle: `Curated offers for Haatza ${module}`,
        image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
        redirect_url: '/offers',
        button_text: 'Explore',
      },
    ];
  }
}
