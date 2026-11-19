/**
 * Strict Type-Aware Null Sanitizer Utility
 *
 * Recursively inspects data structures and replaces missing/null/undefined values
 * with their strictly typed defaults according to the customer-facing contract:
 * - String fields: ""
 * - Numeric fields: 0
 * - Array fields: []
 * - Object fields: {}
 * - Boolean fields: false
 *
 * Preserves all valid values: 0, false, "", [], and non-empty objects.
 */

export const NUMERIC_KEYS = new Set([
  'sequence',
  'price',
  'mrp',
  'discount',
  'onSalePrice',
  'onsale_price',
  'total_items',
  'total_widgets',
  'total',
  'page',
  'limit',
  'totalPages',
  'shippingWeight',
  'stock',
  'rating',
  'reviewCount',
  'discountPercentage',
  'variantPrice',
  'priorityScore',
  'averageCpc',
  'reach',
  'impression',
  'clicks',
  'sales',
  'revenue',
  'sellAndEarnCommission',
  'codPrice',
  'upiPaymentDiscount',
]);

export const BOOLEAN_KEYS = new Set([
  'status',
  'isActive',
  'isAddToCart',
  'isHaatzaLite',
  'is_haatzalite',
  'haatzaVerified',
  'haatza_verified',
  'success',
  'manageVariants',
  'trackInventory',
  'influencerBranding',
  'activeAd',
  'activeAdd',
  'deliveryCharges',
  'isGstSeller',
  'isSellerEarn',
  'isDomestic',
  'inStock',
  'hasNextPage',
  'hasPreviousPage',
]);

export const ARRAY_KEYS = new Set([
  'items',
  'data',
  'widgets',
  'images',
  'promotionalImages',
  'productImages',
  'productCoverImages',
  'productHighlights',
  'searchKeyword',
  'errors',
]);

export const OBJECT_KEYS = new Set([
  'productSpecification',
  'productOptions',
  'returnPolicy',
  'metadata',
  'pagination',
  'category',
  'seller',
]);

export function sanitizeNulls<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return '' as any;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeNulls(item)) as any;
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) {
      return obj.toISOString() as any;
    }
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value === null || value === undefined) {
        if (NUMERIC_KEYS.has(key)) {
          clean[key] = 0;
        } else if (BOOLEAN_KEYS.has(key)) {
          clean[key] = false;
        } else if (ARRAY_KEYS.has(key)) {
          clean[key] = [];
        } else if (OBJECT_KEYS.has(key)) {
          clean[key] = {};
        } else {
          clean[key] = '';
        }
      } else if (typeof value === 'object') {
        clean[key] = sanitizeNulls(value);
      } else {
        clean[key] = value;
      }
    }
    return clean as any;
  }
  return obj;
}
