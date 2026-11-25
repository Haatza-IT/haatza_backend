/**
 * Dashboard Configuration & Domain Constants
 *
 * NOTE: The dashboard module uses its own c4000000-... category IDs,
 * which are independent from the IDs in the legacy Category table.
 */


// Men's Fashion Sub-Category Literal Placeholders
export const PLACEHOLDER_MENS_TSHIRTS_POLOS_ID    = 'PLACEHOLDER_MENS_TSHIRTS_POLOS_ID';
export const PLACEHOLDER_MENS_CASUAL_SHIRTS_ID    = 'PLACEHOLDER_MENS_CASUAL_SHIRTS_ID';
export const PLACEHOLDER_MENS_JEANS_TROUSERS_ID   = 'PLACEHOLDER_MENS_JEANS_TROUSERS_ID';
export const PLACEHOLDER_MENS_ETHNIC_KURTAS_ID    = 'PLACEHOLDER_MENS_ETHNIC_KURTAS_ID';
export const PLACEHOLDER_MENS_JACKETS_HOODIES_ID   = 'PLACEHOLDER_MENS_JACKETS_HOODIES_ID';
export const PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID = 'PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID';
export const PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID = 'PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID';

// Women's Fashion Sub-Category Literal Placeholders
export const PLACEHOLDER_WOMENS_KURTIS_SUITS_ID     = 'PLACEHOLDER_WOMENS_KURTIS_SUITS_ID';
export const PLACEHOLDER_WOMENS_SAREES_ID           = 'PLACEHOLDER_WOMENS_SAREES_ID';
export const PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID = 'PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID';
export const PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID = 'PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID';
export const PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID   = 'PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID';
export const PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID   = 'PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID';
export const PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID  = 'PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID';

export const ALL_CATEGORY_ID                 = 'c4000000-0000-4000-8000-000000000101';
export const MENS_FASHION_CATEGORY_ID        = 'c4000000-0000-4000-8000-000000000102';
export const WOMENS_FASHION_CATEGORY_ID      = 'c4000000-0000-4000-8000-000000000103';
export const ELECTRONICS_CATEGORY_ID         = 'c4000000-0000-4000-8000-000000000104';
export const HOME_AND_LIVING_CATEGORY_ID     = 'c4000000-0000-4000-8000-000000000105';
export const BEAUTY_CATEGORY_ID              = 'c4000000-0000-4000-8000-000000000106';
export const APPLIANCES_CATEGORY_ID          = 'c4000000-0000-4000-8000-000000000107';
export const TOYS_AND_GAMES_CATEGORY_ID      = 'c4000000-0000-4000-8000-000000000108';
export const SPORTS_AND_FITNESS_CATEGORY_ID  = 'c4000000-0000-4000-8000-000000000109';
export const BOOKS_CATEGORY_ID               = 'c4000000-0000-4000-8000-000000000110';
export const FURNITURE_CATEGORY_ID           = 'c4000000-0000-4000-8000-000000000111';
export const GROCERIES_CATEGORY_ID           = 'c4000000-0000-4000-8000-000000000112';
export const AUTOMOTIVE_CATEGORY_ID          = 'c4000000-0000-4000-8000-000000000113';
export const MOBILES_CATEGORY_ID             = 'c4000000-0000-4000-8000-000000000114';
export const BABY_CARE_CATEGORY_ID           = 'c4000000-0000-4000-8000-000000000115';
export const PET_SUPPLIES_CATEGORY_ID        = 'c4000000-0000-4000-8000-000000000116';
export const JEWELRY_CATEGORY_ID             = 'c4000000-0000-4000-8000-000000000117';
export const GIFT_CARD_CATEGORY_ID           = 'c4000000-0000-4000-8000-000000000118';

// LITE Categories (12 Categories: 201 through 212)
export const LITE_ALL_CATEGORY_ID                 = 'c4000000-0000-4000-8000-000000000201';
export const LITE_FRUITS_VEGETABLES_CATEGORY_ID   = 'c4000000-0000-4000-8000-000000000202';
export const LITE_DAILY_BREAKFAST_CATEGORY_ID     = 'c4000000-0000-4000-8000-000000000203';
export const LITE_SNACKS_BEVERAGES_CATEGORY_ID    = 'c4000000-0000-4000-8000-000000000204';
export const LITE_HOUSEHOLD_CLEANING_CATEGORY_ID  = 'c4000000-0000-4000-8000-000000000205';
export const LITE_PERSONAL_CARE_CATEGORY_ID       = 'c4000000-0000-4000-8000-000000000206';
export const LITE_KITCHEN_ESSENTIALS_CATEGORY_ID  = 'c4000000-0000-4000-8000-000000000207';
export const LITE_BAKERY_BREADS_CATEGORY_ID       = 'c4000000-0000-4000-8000-000000000208';
export const LITE_STAPLES_COOKING_CATEGORY_ID     = 'c4000000-0000-4000-8000-000000000209';
export const LITE_FROZEN_FOODS_CATEGORY_ID        = 'c4000000-0000-4000-8000-000000000210';
export const LITE_BABY_CARE_CATEGORY_ID           = 'c4000000-0000-4000-8000-000000000211';
export const LITE_PET_SUPPLIES_CATEGORY_ID        = 'c4000000-0000-4000-8000-000000000212';

// Category aliases
export const LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID = LITE_FRUITS_VEGETABLES_CATEGORY_ID;
export const LITE_DAILY_AND_BREAKFAST_CATEGORY_ID   = LITE_DAILY_BREAKFAST_CATEGORY_ID;
export const LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID  = LITE_SNACKS_BEVERAGES_CATEGORY_ID;
export const LITE_BAKERY_AND_BREADS_CATEGORY_ID     = LITE_BAKERY_BREADS_CATEGORY_ID;
export const LITE_STAPLES_AND_COOKING_CATEGORY_ID   = LITE_STAPLES_COOKING_CATEGORY_ID;

/**
 * 28 Supported Indian State Codes
 */
export const INDIAN_STATE_CODES = [
  'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR',
  'HP', 'JH', 'KA', 'KL', 'MP', 'MH', 'MN', 'ML',
  'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS',
  'TR', 'UP', 'UK', 'WB',
] as const;

export type IndianStateCode = (typeof INDIAN_STATE_CODES)[number];

export function isIndianStateCode(val: unknown): val is IndianStateCode {
  return typeof val === 'string' && (INDIAN_STATE_CODES as readonly string[]).includes(val);
}

/**
 * LITE Warehouse Identifiers
 */
export const LITE_WAREHOUSES = [
  'WAREHOUSE001',
  'WAREHOUSE002',
  'WAREHOUSE003',
  'WAREHOUSE004',
  'WAREHOUSE005',
] as const;

export type LiteWarehouseId = (typeof LITE_WAREHOUSES)[number];

export function isLiteWarehouseId(val: unknown): val is LiteWarehouseId {
  return typeof val === 'string' && (LITE_WAREHOUSES as readonly string[]).includes(val);
}

/**
 * Shared layout placement constants across customer APIs, validation, caching, and admin management.
 */
export const ALLOWED_PLACEMENTS = ['DESKTOP', 'MOBILE'] as const;
export type AllowedPlacement = (typeof ALLOWED_PLACEMENTS)[number];

export function isAllowedPlacement(val: unknown): val is AllowedPlacement {
  return typeof val === 'string' && (ALLOWED_PLACEMENTS as readonly string[]).includes(val);
}

export interface CategoryDefinition {
  no: number;
  name: string;
  categoryId: string;
}

export const HAATZA_CATEGORIES: CategoryDefinition[] = [
  { no: 1, name: 'All', categoryId: ALL_CATEGORY_ID },
  { no: 2, name: "Men's Fashion", categoryId: MENS_FASHION_CATEGORY_ID },
  { no: 3, name: "Women's Fashion", categoryId: WOMENS_FASHION_CATEGORY_ID },
  { no: 4, name: 'Electronics', categoryId: ELECTRONICS_CATEGORY_ID },
  { no: 5, name: 'Home and Living', categoryId: HOME_AND_LIVING_CATEGORY_ID },
  { no: 6, name: 'Beauty', categoryId: BEAUTY_CATEGORY_ID },
  { no: 7, name: 'Appliances', categoryId: APPLIANCES_CATEGORY_ID },
  { no: 8, name: 'Toys and Games', categoryId: TOYS_AND_GAMES_CATEGORY_ID },
  { no: 9, name: 'Sports and Fitness', categoryId: SPORTS_AND_FITNESS_CATEGORY_ID },
  { no: 10, name: 'Books', categoryId: BOOKS_CATEGORY_ID },
  { no: 11, name: 'Furniture', categoryId: FURNITURE_CATEGORY_ID },
  { no: 12, name: 'Groceries', categoryId: GROCERIES_CATEGORY_ID },
  { no: 13, name: 'Automotive', categoryId: AUTOMOTIVE_CATEGORY_ID },
  { no: 14, name: 'Mobiles', categoryId: MOBILES_CATEGORY_ID },
  { no: 15, name: 'Baby Care', categoryId: BABY_CARE_CATEGORY_ID },
  { no: 16, name: 'Pet Supplies', categoryId: PET_SUPPLIES_CATEGORY_ID },
  { no: 17, name: 'Jewelry', categoryId: JEWELRY_CATEGORY_ID },
  { no: 18, name: 'Gift Card', categoryId: GIFT_CARD_CATEGORY_ID },
];

export const LITE_CATEGORIES: CategoryDefinition[] = [
  { no: 1, name: 'All', categoryId: LITE_ALL_CATEGORY_ID },
  { no: 2, name: 'Fruits and Vegetables', categoryId: LITE_FRUITS_VEGETABLES_CATEGORY_ID },
  { no: 3, name: 'Daily and Breakfast', categoryId: LITE_DAILY_BREAKFAST_CATEGORY_ID },
  { no: 4, name: 'Snacks and Beverages', categoryId: LITE_SNACKS_BEVERAGES_CATEGORY_ID },
  { no: 5, name: 'Household Cleaning', categoryId: LITE_HOUSEHOLD_CLEANING_CATEGORY_ID },
  { no: 6, name: 'Personal Care', categoryId: LITE_PERSONAL_CARE_CATEGORY_ID },
  { no: 7, name: 'Kitchen Essentials', categoryId: LITE_KITCHEN_ESSENTIALS_CATEGORY_ID },
  { no: 8, name: 'Bakery and Breads', categoryId: LITE_BAKERY_BREADS_CATEGORY_ID },
  { no: 9, name: 'Staples and Cooking', categoryId: LITE_STAPLES_COOKING_CATEGORY_ID },
  { no: 10, name: 'Frozen Foods', categoryId: LITE_FROZEN_FOODS_CATEGORY_ID },
  { no: 11, name: 'Baby Care', categoryId: LITE_BABY_CARE_CATEGORY_ID },
  { no: 12, name: 'Pet Supplies', categoryId: LITE_PET_SUPPLIES_CATEGORY_ID },
];

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
  // LITE Widget Names
  'Everyday Essentials': 'PRODUCT',
  'Live Automated Dispatch Belt': 'BANNER',
  'Promo Banner': 'BANNER',
  'Offer Banner': 'BANNER',
  'Fresh Fruits and Daily Greens': 'PRODUCT',
  'Household Cleaning and Hygiene': 'PRODUCT',
  'Category Products': 'PRODUCT',
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

export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_PAGE: 1,
  MIN_LIMIT: 1,
  MAX_LIMIT: 50,
} as const;

