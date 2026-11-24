/**
 * Dashboard Configuration & Domain Constants
 *
 * NOTE: The dashboard module uses its own c4000000-... category IDs,
 * which are independent from the IDs in the legacy Category table.
 */

export const PLACEHOLDER_MENS_FASHION_ID = 'PLACEHOLDER_MENS_FASHION_ID';
export const PLACEHOLDER_WOMENS_FASHION_ID = 'PLACEHOLDER_WOMENS_FASHION_ID';
export const PLACEHOLDER_KIDS_FASHION_ID = 'PLACEHOLDER_KIDS_FASHION_ID';

export interface CategoryDefinition {
  no: number;
  name: string;
  categoryId: string;
}

export const HAATZA_CATEGORIES: CategoryDefinition[] = [
  { no: 1, name: 'All', categoryId: 'c4000000-0000-4000-8000-000000000101' },
  { no: 2, name: 'Electronics', categoryId: 'c4000000-0000-4000-8000-000000000102' },
  { no: 3, name: 'Home and Living', categoryId: 'c4000000-0000-4000-8000-000000000103' },
  { no: 4, name: 'Beauty', categoryId: 'c4000000-0000-4000-8000-000000000104' },
  { no: 5, name: 'Appliances', categoryId: 'c4000000-0000-4000-8000-000000000105' },
  { no: 6, name: 'Toys and Games', categoryId: 'c4000000-0000-4000-8000-000000000106' },
  { no: 7, name: 'Sports and Fitness', categoryId: 'c4000000-0000-4000-8000-000000000107' },
  { no: 8, name: 'Books', categoryId: 'c4000000-0000-4000-8000-000000000108' },
  { no: 9, name: 'Furniture', categoryId: 'c4000000-0000-4000-8000-000000000109' },
  { no: 10, name: 'Groceries', categoryId: 'c4000000-0000-4000-8000-000000000110' },
  { no: 11, name: 'Automotive', categoryId: 'c4000000-0000-4000-8000-000000000111' },
  { no: 12, name: 'Mobiles', categoryId: 'c4000000-0000-4000-8000-000000000112' },
  { no: 13, name: 'Baby Care', categoryId: 'c4000000-0000-4000-8000-000000000113' },
  { no: 14, name: 'Pet Supplies', categoryId: 'c4000000-0000-4000-8000-000000000114' },
  { no: 15, name: 'Jewelry', categoryId: 'c4000000-0000-4000-8000-000000000115' },
  { no: 16, name: 'Gift Card', categoryId: 'c4000000-0000-4000-8000-000000000116' },
  { no: 17, name: '(reserved, name to be confirmed)', categoryId: 'c4000000-0000-4000-8000-000000000117' },
  { no: 18, name: '(reserved, name to be confirmed)', categoryId: 'c4000000-0000-4000-8000-000000000118' },
];

export const ALL_CATEGORY_ID = 'c4000000-0000-4000-8000-000000000101';

export type WidgetItemType = 'BANNER' | 'CATEGORY_TILE' | 'PRODUCT';

export interface WidgetDefinition {
  widgetNo: number;
  widgetName: string;
  sequence: number;
  widgetRedirectTo: 'NONE' | 'OFFERS' | 'CATEGORY' | 'PRODUCT';
  itemType: WidgetItemType;
}

export const HAATZA_WIDGETS: WidgetDefinition[] = [
  { widgetNo: 1, widgetName: 'Hero Banner', sequence: 1, widgetRedirectTo: 'NONE', itemType: 'BANNER' },
  { widgetNo: 2, widgetName: 'Offers Banner', sequence: 2, widgetRedirectTo: 'OFFERS', itemType: 'BANNER' },
  { widgetNo: 3, widgetName: 'Top Categories', sequence: 3, widgetRedirectTo: 'NONE', itemType: 'CATEGORY_TILE' },
  { widgetNo: 4, widgetName: 'Suggested for You', sequence: 4, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 5, widgetName: 'Promo Banners', sequence: 5, widgetRedirectTo: 'NONE', itemType: 'BANNER' },
  { widgetNo: 6, widgetName: 'Liked by You', sequence: 6, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 7, widgetName: 'Recently Viewed by You', sequence: 7, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 8, widgetName: 'Banner for ₹49 Store, Trending Fashion, Bestseller Favorites, and Big Deals', sequence: 8, widgetRedirectTo: 'NONE', itemType: 'BANNER' },
  { widgetNo: 9, widgetName: 'Trending Fashion', sequence: 9, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 10, widgetName: 'Deals of the Day', sequence: 10, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 11, widgetName: '₹49 Promotional Banner', sequence: 11, widgetRedirectTo: 'NONE', itemType: 'BANNER' },
  { widgetNo: 12, widgetName: '₹49 Products', sequence: 12, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 13, widgetName: 'Hurry Deals – Ending Soon', sequence: 13, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 14, widgetName: 'Bestseller Favorites', sequence: 14, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 15, widgetName: 'Fresh New Arrivals', sequence: 15, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
  { widgetNo: 16, widgetName: 'More to Explore', sequence: 16, widgetRedirectTo: 'NONE', itemType: 'PRODUCT' },
];

/**
 * Rule B Sequences for Categories 102 through 118 (9 widgets total):
 * 1, 3, 4, 5, 6, 9, 10, 15, 16
 */
export const RULE_B_SEQUENCES = [1, 3, 4, 5, 6, 9, 10, 15, 16];

/**
 * Map widget number or widget name to its item type
 */
export const WIDGET_NAME_TO_TYPE: Record<string, WidgetItemType> = {
  'Hero Banner': 'BANNER',
  'Offers Banner': 'BANNER',
  'Top Categories': 'CATEGORY_TILE',
  'Suggested for You': 'PRODUCT',
  'Promo Banners': 'BANNER',
  'Liked by You': 'PRODUCT',
  'Recently Viewed by You': 'PRODUCT',
  'Banner for ₹49 Store, Trending Fashion, Bestseller Favorites, and Big Deals': 'BANNER',
  'Trending Fashion': 'PRODUCT',
  'Deals of the Day': 'PRODUCT',
  '₹49 Promotional Banner': 'BANNER',
  '₹49 Products': 'PRODUCT',
  'Hurry Deals – Ending Soon': 'PRODUCT',
  'Bestseller Favorites': 'PRODUCT',
  'Fresh New Arrivals': 'PRODUCT',
  'More to Explore': 'PRODUCT',
};

/**
 * Section 10 Field Type Map & Defaults
 */
export const FIELD_DEFAULTS = {
  WIDGET: {
    widget_id: '',
    widget_name: '',
    sequence: 0,
    widget_redirect_to: 'NONE',
    redirect_category_id: '',
    redirect_product_id: '',
    items: [],
  },
  BANNER_ITEM: {
    banner_image: '',
    title: '',
    content: '',
    redirect_category_id: '',
    redirect_url: '',
  },
  CATEGORY_TILE: {
    category_name: '',
    category_image: '',
    category_id: '',
  },
  PRODUCT_ITEM: {
    product_id: '',
    product_title: '',
    product_image: '',
    category_id: '',
    mrp: 0.0,
    discount_price: 0.0,
    discount_percentage: 0,
    is_add_to_cart: false,
  },
};

export const CACHE_DEFAULTS = {
  TTL_SECONDS: parseInt(process.env.DASHBOARD_CACHE_TTL_SECONDS || '300', 10),
  MAX_ENTRIES: 500,
};
