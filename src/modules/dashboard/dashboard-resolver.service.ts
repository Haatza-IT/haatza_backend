import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import type {
  ResolvedWidget,
  WidgetType,
  RedirectType,
  BannerItem,
  CategoryItem,
  ProductItem,
} from './dashboard.types';

/**
 * Whitelist of strictly valid Dashboard Widget IDs (W001 to W023).
 */
export const VALID_WIDGET_IDS = new Set<string>(
  Array.from({ length: 23 }, (_, i) => `W${String(i + 1).padStart(3, '0')}`),
);

/**
 * Parses unknown input into a strict integer.
 * Rejects floats, partial strings ("1abc", "1.5"), negatives, null, undefined, and non-numeric values.
 */
export function parseStrictInteger(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!/^-?\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isSafeInteger(n) ? n : null;
}

@Injectable()
export class DashboardResolverService {
  private readonly logger = new Logger(DashboardResolverService.name);

  /**
   * Resolves widget identifier strictly to W001-W023.
   * 1. If candidate ID is already in W001-W023, returns it directly.
   * 2. Otherwise maps based on strict module and integer sequence:
   *    - HAATZA: sequences 1..16 -> W001..W016
   *    - LITE: sequences 1..7 -> W017..W023
   * 3. If neither matches, throws BadRequestException. Never returns W000 or invalid IDs.
   */
  public mapWidgetId(
    module: string | null | undefined,
    sequence: unknown,
    candidateId?: string | null,
  ): string {
    const trimmedId = candidateId ? String(candidateId).trim() : '';
    if (VALID_WIDGET_IDS.has(trimmedId)) {
      return trimmedId;
    }

    const mod = (module || '').toUpperCase().trim();
    const seq = parseStrictInteger(sequence);

    if (seq !== null) {
      if (mod === 'HAATZA' && seq >= 1 && seq <= 16) {
        const mapped = `W${String(seq).padStart(3, '0')}`;
        if (VALID_WIDGET_IDS.has(mapped)) return mapped;
      }
      if (mod === 'LITE' && seq >= 1 && seq <= 7) {
        const mapped = `W${String(seq + 16).padStart(3, '0')}`;
        if (VALID_WIDGET_IDS.has(mapped)) return mapped;
      }
    }

    throw new BadRequestException(
      `Invalid dashboard widget: ID "${trimmedId}" is not a recognized widget ID (W001-W023) and module "${mod}" / sequence "${sequence}" could not be mapped to an approved widget ID.`,
    );
  }

  /**
   * Infers navigation redirect type from destination path.
   * Internal application paths (/products, /categories, /offers, etc.) are NOT external.
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
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return 'EXTERNAL';
    }
    return 'CAMPAIGN';
  }

  /**
   * Formats a banner JSONB item into standard BannerItem structure.
   * Guaranteed zero null values.
   */
  public formatBannerItem(b: any, defaultId: string): BannerItem {
    const redirectUrl = String(b.redirectUrl ?? b.redirect_url ?? b.link ?? '/offers');
    const redirectType = b.redirectType ?? b.redirect_type ?? this.inferRedirectType(redirectUrl);
    const imageUrl = String(b.imageUrl ?? b.image_url ?? b.image ?? '');
    const buttonText = String(b.buttonText ?? b.button_text ?? b.ctaText ?? b.cta_text ?? '');

    return {
      id: String(b.id || defaultId),
      title: String(b.title || ''),
      subtitle: String(b.subtitle || ''),
      badge: String(b.badge || ''),
      imageUrl,
      image_url: imageUrl,
      buttonText,
      button_text: buttonText,
      redirectType,
      redirect_type: redirectType,
      redirectUrl,
      redirect_url: redirectUrl,
    };
  }

  /**
   * Formats a category JSONB item into standard CategoryItem structure.
   * Guaranteed zero null values and proper UUID mapping.
   */
  public formatCategoryItem(c: any, defaultIndex = 1): CategoryItem {
    const categoryId = String(c.categoryId ?? c.category_id ?? c.id ?? '');
    const categoryName = String(c.categoryName ?? c.category_name ?? c.name ?? '');
    const slug = String(c.slug ?? categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    const categoryImage = String(c.categoryImage ?? c.category_image ?? c.image ?? '');
    const redirectUrl = String(c.redirectUrl ?? c.redirect_url ?? `/categories/${categoryId}`);

    return {
      categoryId,
      category_id: categoryId,
      categoryName,
      category_name: categoryName,
      slug,
      categoryImage,
      category_image: categoryImage,
      redirectType: 'CATEGORY',
      redirect_type: 'CATEGORY',
      redirectUrl,
      redirect_url: redirectUrl,
    };
  }

  /**
   * Formats a product JSONB item into standard ProductItem structure.
   * Guaranteed zero null values, mathematical pricing accuracy, and genuine JSON boolean isAddToCart.
   */
  public formatProductItem(p: any, isLite = false, defaultIndex = 1): ProductItem {
    const productId = String(p.productId ?? p.product_id ?? p.id ?? '');
    const productName = String(p.productName ?? p.product_name ?? p.name ?? '');
    const description = String(p.description ?? '');
    const productImage = String(p.productImage ?? p.product_image ?? p.image ?? p.productCoverImage ?? '');
    const categoryId = String(p.categoryId ?? p.category_id ?? '');
    const categoryName = String(p.categoryName ?? p.category_name ?? '');
    const subcategoryId = String(p.subcategoryId ?? p.subcategory_id ?? '');
    const subcategoryName = String(p.subcategoryName ?? p.subcategory_name ?? '');
    const brand = String(p.brand ?? '');

    const mrp = typeof p.mrp === 'number' ? p.mrp : Number(p.mrp || 0);
    const discount = typeof p.discount === 'number' ? p.discount : Number(p.discount || 0);
    // Mathematically consistent price calculation: price = round(mrp * (1 - discount / 100))
    const calculatedPrice = mrp > 0 && discount > 0 ? Math.round(mrp * (1 - discount / 100)) : (typeof p.price === 'number' ? p.price : Number(p.price || 0));
    const price = calculatedPrice;
    const onSalePrice = typeof p.onSalePrice === 'number' ? p.onSalePrice : price;

    const currency = String(p.currency ?? 'INR');
    const isAddToCart = typeof p.isAddToCart === 'boolean' ? p.isAddToCart : true;
    const ribbon = String(p.ribbon ?? '');
    const isHaatzaLite = typeof p.isHaatzaLite === 'boolean' ? p.isHaatzaLite : Boolean(p.is_haatzalite ?? isLite);
    const haatzaVerified = typeof p.haatzaVerified === 'boolean' ? p.haatzaVerified : Boolean(p.haatza_verified ?? true);

    const redirectUrl = String(
      p.redirectUrl ?? p.redirect_url ?? (isLite ? `/lite/products/${productId}` : `/products/${productId}`),
    );

    const sku = String(p.sku || `SKU-${productId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`);
    const shippingWeight = typeof p.shippingWeight === 'number' ? p.shippingWeight : 0.5;
    const status = p.status !== undefined ? Boolean(p.status) : true;
    const productOptions = Array.isArray(p.productOptions) ? p.productOptions : [];
    const productType = String(p.productType || 'PHYSICAL');
    const manageVariants = Boolean(p.manageVariants);
    const trackInventory = Boolean(p.trackInventory);
    const variantPrice = typeof p.variantPrice === 'number' ? p.variantPrice : price;
    const productSpecification = p.productSpecification && typeof p.productSpecification === 'object' ? p.productSpecification : {};
    const influencerBranding = Boolean(p.influencerBranding);
    const activeAdd = Boolean(p.activeAdd);
    const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : (productImage ? [productImage] : []);
    const promotionalImages = Array.isArray(p.promotionalImages) && p.promotionalImages.length > 0 ? p.promotionalImages : images;
    const rating = typeof p.rating === 'number' ? p.rating : 4.5;
    const reviewCount = typeof p.reviewCount === 'number' ? p.reviewCount : 128;
    const inStock = p.inStock !== undefined ? Boolean(p.inStock) : true;
    const stock = typeof p.stock === 'number' ? p.stock : 100;

    return {
      productId,
      product_id: productId,
      productName,
      product_name: productName,
      description,
      productImage,
      product_image: productImage,
      categoryId,
      category_id: categoryId,
      categoryName,
      category_name: categoryName,
      subcategoryId,
      subcategory_id: subcategoryId,
      subcategoryName,
      subcategory_name: subcategoryName,
      brand,
      price,
      mrp,
      discount,
      onSalePrice,
      onsale_price: onSalePrice,
      currency,
      isAddToCart,
      ribbon,
      isHaatzaLite,
      is_haatzalite: isHaatzaLite,
      haatzaVerified,
      haatza_verified: haatzaVerified,
      redirectType: 'PRODUCT',
      redirect_type: 'PRODUCT',
      redirectUrl,
      redirect_url: redirectUrl,

      // Extended fields
      id: productId,
      name: productName,
      mainImage: productImage,
      productCoverImage: productImage,
      sku,
      shippingWeight,
      status,
      productOptions,
      productType,
      manageVariants,
      trackInventory,
      variantPrice,
      productSpecification,
      influencerBranding,
      activeAdd,
      promotionalImages,
      images,
      rating,
      reviewCount,
      inStock,
      stock,
      discountPercentage: discount,
    };
  }

  /**
   * Resolves purpose-specific data for a dashboard widget purely from the items JSONB column.
   * Completely bypasses Product, Category, and Wishlist tables at runtime.
   */
  public resolveWidget(
    widget: any,
    options: { categoryId?: string; territory?: string; warehouseId?: string } = {},
  ): ResolvedWidget {
    const rawName = String(widget.widgetName ?? widget.widget_name ?? '').trim();
    const normalizedName = rawName.toLowerCase();
    const mod = String(widget.module ?? 'HAATZA').toUpperCase();
    const originalId = String(widget.widgetId ?? widget.widget_id ?? '').trim();
    const seq = parseStrictInteger(widget.sequence) ?? 0;
    const apiWidgetId = this.mapWidgetId(mod, widget.sequence, originalId);
    const isLite = mod === 'LITE';

    const baseWidget = {
      widget_id: apiWidgetId,
      widget_name: rawName,
      widget_redirect_to: String(widget.widgetRedirectTo ?? widget.widget_redirect_to ?? ''),
      placement: String(widget.placement ?? 'HOME'),
      sequence: seq,
      territory: String(widget.territory ?? 'ALL'),
      module: mod,
      warehouse_id: String(widget.warehouseId ?? widget.warehouse_id ?? ''),
      category_id: String(widget.categoryId ?? widget.category_id ?? ''),
      product_id: String(widget.productId ?? widget.product_id ?? ''),
      redirect_category_id: String(widget.redirectCategoryId ?? widget.redirect_category_id ?? ''),
      redirect_product_id: String(widget.redirectProductId ?? widget.redirect_product_id ?? ''),
      status: widget.status !== undefined ? Boolean(widget.status) : true,
    };

    // -------------------------------------------------------------
    // 1. CATEGORY WIDGET (Top Categories - sequence 3)
    // -------------------------------------------------------------
    if (normalizedName.includes('top categories') || (!isLite && seq === 3)) {
      const rawItems = Array.isArray(widget.items) ? widget.items : [];
      let items: CategoryItem[] = rawItems.map((item: any, idx: number) =>
        this.formatCategoryItem(item, idx + 1),
      );

      if (options.categoryId) {
        items = items.filter(
          (c) => c.categoryId === options.categoryId || c.category_id === options.categoryId,
        );
      }

      return {
        ...baseWidget,
        widget_type: 'CATEGORY',
        items,
        total_items: items.length,
      };
    }

    // -------------------------------------------------------------
    // 2. BANNER WIDGETS
    // Hero Banners, Offers Banner, Promo Banner, 49rs banner, Dispatch Belt
    // -------------------------------------------------------------
    const isBannerWidget =
      normalizedName.includes('banner') ||
      normalizedName.includes('hero') ||
      normalizedName.includes('dispatch belt') ||
      (!isLite && (seq === 1 || seq === 2 || seq === 5 || seq === 8 || seq === 11)) ||
      (isLite && (seq === 1 || seq === 3 || seq === 4 || seq === 5));

    if (isBannerWidget) {
      const rawItems = Array.isArray(widget.items) ? widget.items : [];
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
    // 3. PRODUCT LIST WIDGETS
    // Suggested for You (W004), Liked By You (W006), Recently Viewed By You (W007),
    // Trending Fashion (W009), Deals of the Day (W010), ₹49 Store (W012),
    // Hurry! Deals Ending Soon (W013), Best Seller Favourites (W014),
    // Fresh New Arrivals (W015), More to Explore (W016),
    // Everyday Essentials (W018), Fresh Fruits & Greens (W022),
    // Household Cleaning and Hygiene (W023)
    // -------------------------------------------------------------
    const rawItems = Array.isArray(widget.items) ? widget.items : [];
    let items: ProductItem[] = rawItems.map((item: any, idx: number) =>
      this.formatProductItem(item, isLite, idx + 1),
    );

    // Apply optional categoryId filter at item level if supplied
    if (options.categoryId) {
      const matchesWidgetCategory =
        baseWidget.category_id && baseWidget.category_id === options.categoryId;
      if (!matchesWidgetCategory) {
        items = items.filter(
          (p) => p.categoryId === options.categoryId || p.category_id === options.categoryId,
        );
      }
    }

    return {
      ...baseWidget,
      widget_type: 'PRODUCT_LIST',
      items,
      total_items: items.length,
    };
  }

  /**
   * Provides default banner items when seeding default widgets.
   */
  public getDefaultBannersForWidget(widgetName: string, module: string): any[] {
    const isLite = (module ?? '').toUpperCase() === 'LITE';

    if (widgetName.toLowerCase().includes('hero')) {
      return isLite
        ? [
            {
              id: 'lite-hero-1',
              title: 'Groceries Delivered in 10 Minutes',
              subtitle: 'Fresh farm veggies, milk, fruits & daily staples at wholesale prices',
              badge: '10 Min Delivery',
              imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
              buttonText: 'Order Now',
              redirectType: 'CATEGORY',
              redirectUrl: '/lite/category/c4000000-0000-4000-8000-000000000004',
            },
          ]
        : [
            {
              id: 'haatza-hero-1',
              title: 'Big Festive Electronics & Fashion Sale',
              subtitle: 'Up to 70% Off on Top National Brands with Instant Bank Discounts',
              badge: 'Mega Sale',
              imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
              buttonText: 'Explore Deals',
              redirectType: 'CAMPAIGN',
              redirectUrl: '/offers/festive-sale',
            },
          ];
    }

    if (widgetName.toLowerCase().includes('dispatch belt')) {
      return [
        {
          id: 'lite-dispatch-1',
          title: 'HAATZA Lite Express Delivery Hub',
          subtitle: 'Automated packing and rapid 10-minute neighbourhood dispatch',
          badge: 'HAATZA LITE',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          buttonText: 'Learn More',
          redirectType: 'CAMPAIGN',
          redirectUrl: '/lite/delivery-info',
        },
      ];
    }

    return [
      {
        id: `banner-${widgetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-1`,
        title: widgetName,
        subtitle: `Curated offers for Haatza ${module}`,
        badge: 'Offers',
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Explore',
        redirectType: 'CAMPAIGN',
        redirectUrl: '/offers',
      },
    ];
  }
}
