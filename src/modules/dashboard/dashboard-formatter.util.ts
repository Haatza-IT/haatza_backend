import {
  WIDGET_NAME_TO_TYPE,
  FIELD_DEFAULTS,
  WidgetItemType,
} from './dashboard.config';
import type {
  CleanDashboardWidget,
  CustomerDashboardResponse,
} from './dashboard.types';

/**
 * Normalizes a field value based on its target data type according to Section 10.
 * Preserves genuine values (e.g. false, 0, non-empty strings) and only substitutes
 * default values when the field is null, undefined, or missing.
 */
function normalizeString(val: unknown, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function normalizeInt(val: unknown, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const n = parseInt(String(val), 10);
  return Number.isNaN(n) ? fallback : n;
}

function normalizeDecimal(val: unknown, fallback = 0.0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const n = parseFloat(String(val));
  return Number.isNaN(n) ? fallback : Math.round(n * 100) / 100;
}

function normalizeBoolean(val: unknown, fallback = false): boolean {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  if (s === 'true' || s === '1') return true;
  if (s === 'false' || s === '0') return false;
  return fallback;
}

/**
 * Formats a single item inside the `items` array based on the widget item type.
 * Enforces all required fields per Section 10, passes unmapped fields through,
 * and preserves valid falsy values (0, false, empty strings).
 */
export function formatWidgetItem(item: any, itemType: WidgetItemType): any {
  if (!item || typeof item !== 'object') {
    return item;
  }

  // Clone item so we don't mutate input
  const formatted: Record<string, any> = { ...item };

  if (itemType === 'BANNER') {
    formatted.banner_image = normalizeString(
      formatted.banner_image ?? formatted.bannerImage ?? formatted.imageUrl ?? formatted.image,
      FIELD_DEFAULTS.BANNER_ITEM.banner_image,
    );
    formatted.title = normalizeString(
      formatted.title,
      FIELD_DEFAULTS.BANNER_ITEM.title,
    );
    formatted.content = normalizeString(
      formatted.content ?? formatted.subtitle,
      FIELD_DEFAULTS.BANNER_ITEM.content,
    );
    formatted.redirect_category_id = normalizeString(
      formatted.redirect_category_id ?? formatted.redirectCategoryId,
      FIELD_DEFAULTS.BANNER_ITEM.redirect_category_id,
    );
    formatted.redirect_url = normalizeString(
      formatted.redirect_url ?? formatted.redirectUrl,
      FIELD_DEFAULTS.BANNER_ITEM.redirect_url,
    );
  } else if (itemType === 'CATEGORY_TILE') {
    formatted.category_name = normalizeString(
      formatted.category_name ?? formatted.categoryName ?? formatted.name,
      FIELD_DEFAULTS.CATEGORY_TILE.category_name,
    );
    formatted.category_image = normalizeString(
      formatted.category_image ?? formatted.categoryImage ?? formatted.image,
      FIELD_DEFAULTS.CATEGORY_TILE.category_image,
    );
    formatted.category_id = normalizeString(
      formatted.category_id ?? formatted.categoryId ?? formatted.id,
      FIELD_DEFAULTS.CATEGORY_TILE.category_id,
    );
  } else if (itemType === 'PRODUCT') {
    formatted.product_id = normalizeString(
      formatted.product_id ?? formatted.productId ?? formatted.id,
      FIELD_DEFAULTS.PRODUCT_ITEM.product_id,
    );
    formatted.product_title = normalizeString(
      formatted.product_title ?? formatted.productTitle ?? formatted.productName ?? formatted.name,
      FIELD_DEFAULTS.PRODUCT_ITEM.product_title,
    );
    formatted.product_image = normalizeString(
      formatted.product_image ?? formatted.productImage ?? formatted.productCoverImage ?? formatted.image,
      FIELD_DEFAULTS.PRODUCT_ITEM.product_image,
    );
    formatted.category_id = normalizeString(
      formatted.category_id ?? formatted.categoryId,
      FIELD_DEFAULTS.PRODUCT_ITEM.category_id,
    );
    formatted.mrp = normalizeDecimal(
      formatted.mrp,
      FIELD_DEFAULTS.PRODUCT_ITEM.mrp,
    );
    formatted.discount_price = normalizeDecimal(
      formatted.discount_price ?? formatted.discountPrice ?? formatted.onSalePrice ?? formatted.price,
      FIELD_DEFAULTS.PRODUCT_ITEM.discount_price,
    );
    formatted.discount_percentage = normalizeInt(
      formatted.discount_percentage ?? formatted.discountPercentage ?? formatted.discount,
      FIELD_DEFAULTS.PRODUCT_ITEM.discount_percentage,
    );
    formatted.is_add_to_cart = normalizeBoolean(
      formatted.is_add_to_cart ?? formatted.isAddToCart,
      FIELD_DEFAULTS.PRODUCT_ITEM.is_add_to_cart,
    );
  }

  // Remove any unintentional undefined or null values across the item
  for (const [k, v] of Object.entries(formatted)) {
    if (v === null || v === undefined) {
      formatted[k] = '';
    }
  }

  return formatted;
}

/**
 * Determines the widget item type from the widget name
 */
export function getWidgetItemType(widgetName: string): WidgetItemType {
  const trimmed = (widgetName || '').trim();
  if (WIDGET_NAME_TO_TYPE[trimmed]) {
    return WIDGET_NAME_TO_TYPE[trimmed];
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes('category') || lower.includes('categories')) {
    return 'CATEGORY_TILE';
  }
  if (lower.includes('banner')) {
    return 'BANNER';
  }
  return 'PRODUCT';
}

/**
 * Formats a raw database dashboard record into a clean widget representation:
 * - Omits internal DB columns: product_id, warehouse_id, territory, module,
 *   created_by, updated_by, created_at, updated_at, placement.
 * - Applies Section 10 defaults to all widget and item fields.
 */
export function formatCleanWidget(raw: any): CleanDashboardWidget {
  const widgetId = normalizeString(raw.widget_id ?? raw.widgetId, FIELD_DEFAULTS.WIDGET.widget_id);
  const widgetName = normalizeString(raw.widget_name ?? raw.widgetName, FIELD_DEFAULTS.WIDGET.widget_name);
  const sequence = normalizeInt(raw.sequence, FIELD_DEFAULTS.WIDGET.sequence);
  const widgetRedirectTo = normalizeString(
    raw.widget_redirect_to ?? raw.widgetRedirectTo,
    FIELD_DEFAULTS.WIDGET.widget_redirect_to,
  ) || 'NONE';
  const redirectCategoryId = normalizeString(
    raw.redirect_category_id ?? raw.redirectCategoryId,
    FIELD_DEFAULTS.WIDGET.redirect_category_id,
  );
  const redirectProductId = normalizeString(
    raw.redirect_product_id ?? raw.redirectProductId,
    FIELD_DEFAULTS.WIDGET.redirect_product_id,
  );

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const itemType = getWidgetItemType(widgetName);
  const formattedItems = rawItems.map((item: any) => formatWidgetItem(item, itemType));

  return {
    widget_id: widgetId,
    widget_name: widgetName,
    sequence,
    widget_redirect_to: widgetRedirectTo,
    redirect_category_id: redirectCategoryId,
    redirect_product_id: redirectProductId,
    items: formattedItems,
  };
}

/**
 * Formats the final Customer Dashboard API response envelope per Section 4.
 */
export function formatDashboardResponse(
  module: string,
  categoryId: string,
  territory: string,
  rawWidgets: any[],
  warehouseId?: string,
): CustomerDashboardResponse {
  const cleanWidgets: CleanDashboardWidget[] = rawWidgets.map(formatCleanWidget);

  // Strictly sort by sequence ascending, with deterministic tie-breaker on widget_id ascending
  cleanWidgets.sort((a, b) => a.sequence - b.sequence || a.widget_id.localeCompare(b.widget_id));

  const response: CustomerDashboardResponse = {
    success: true,
    module: module.toUpperCase(),
    categoryId: categoryId || '',
    territory: territory || '',
    count: cleanWidgets.length,
    widgets: cleanWidgets,
  };

  if (module.toUpperCase() === 'LITE') {
    response.warehouseId = warehouseId || '';
  }

  return response;
}
