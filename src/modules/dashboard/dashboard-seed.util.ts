import {
  HAATZA_CATEGORIES,
  HAATZA_WIDGETS,
  RULE_B_SEQUENCES,
  LITE_WAREHOUSES,
  LITE_CATEGORIES,
} from './dashboard.config';
import { HAATZA_DASHBOARD_ITEMS } from './data/haatza-dashboard-items.data';
import { LITE_29_WIDGET_TEMPLATE } from './data/lite-dashboard-items.data';

export const HAATZA_EFFECTIVE_FROM = '2026-11-01 00:00:00+05:30';
export const HAATZA_EFFECTIVE_TO = '2026-12-31 23:59:59+05:30';

// Copied directly from the 7 legacy LITE rows in PostgreSQL (W017–W023)
export const LITE_EFFECTIVE_FROM = '2026-11-24T03:49:23.183Z';
export const LITE_EFFECTIVE_TO = '2099-12-31T23:59:59.000Z';

/**
 * Returns mock items for a given widget ID from the central tracked dataset.
 */
export function getItemsForWidget(widgetId: string): any[] {
  return HAATZA_DASHBOARD_ITEMS[widgetId] || [];
}

export interface DashboardSeedRow {
  widget_id: string;
  widget_name: string;
  widget_redirect_to: string;
  placement: string;
  sequence: number;
  territory: string;
  items: any[];
  product_id: string;
  category_id: string;
  warehouse_id: string;
  redirect_category_id: string;
  redirect_product_id: string;
  effective_from: string;
  effective_to: string;
  status: boolean;
  module: string;
  created_by: string;
  updated_by: string;
}

/**
 * Generates all 628 planned rows for the HAATZA + LITE Dashboard architecture:
 * 1. 169 HAATZA DESKTOP rows (w0001–w0169, territory: 'ALL')
 * 2. 290 LITE rows (w0170–w0459, territory: 'ALL', 5 warehouses x 2 placements x 29 rows)
 * 3. 169 HAATZA MOBILE rows (w0460–w0628, territory: 'ALL', twins of w0001–w0169)
 */
export function generate628DashboardRows(): DashboardSeedRow[] {
  const rows: DashboardSeedRow[] = [];

  // =========================================================================
  // BLOCK 1: 169 HAATZA DESKTOP ROWS (w0001–w0169)
  // =========================================================================
  let haatzaDesktopIndex = 1;
  const haatzaDesktopRows: DashboardSeedRow[] = [];

  for (const cat of HAATZA_CATEGORIES) {
    const isAll = cat.no === 1;
    const seqsToInclude = isAll
      ? Array.from({ length: 16 }, (_, i) => i + 1)
      : RULE_B_SEQUENCES;

    for (const seq of seqsToInclude) {
      const widgetDef = HAATZA_WIDGETS.find((w) => w.sequence === seq);
      if (!widgetDef) continue;

      const widgetId = `w${String(haatzaDesktopIndex).padStart(4, '0')}`;
      const items = HAATZA_DASHBOARD_ITEMS[widgetId] || [];

      const row: DashboardSeedRow = {
        widget_id: widgetId,
        widget_name: widgetDef.widgetName,
        widget_redirect_to: widgetDef.widgetRedirectTo,
        placement: 'DESKTOP',
        sequence: seq,
        territory: 'ALL',
        items,
        product_id: '',
        category_id: cat.categoryId,
        warehouse_id: '',
        redirect_category_id: '',
        redirect_product_id: '',
        effective_from: HAATZA_EFFECTIVE_FROM,
        effective_to: HAATZA_EFFECTIVE_TO,
        status: true,
        module: 'HAATZA',
        created_by: 'admin1',
        updated_by: 'admin1',
      };

      haatzaDesktopRows.push(row);
      rows.push(row);
      haatzaDesktopIndex++;
    }
  }

  // =========================================================================
  // BLOCK 2: 290 LITE ROWS (w0170–w0459)
  // 5 Warehouses x 2 Placements (DESKTOP, MOBILE) x 29 Widgets
  // =========================================================================
  let liteIndex = 170;

  for (const warehouse of LITE_WAREHOUSES) {
    for (const placement of ['DESKTOP', 'MOBILE'] as const) {
      for (const t of LITE_29_WIDGET_TEMPLATE) {
        const widgetId = `w${String(liteIndex).padStart(4, '0')}`;

        const row: DashboardSeedRow = {
          widget_id: widgetId,
          widget_name: t.widgetName,
          widget_redirect_to: 'NONE',
          placement,
          sequence: t.sequence,
          territory: 'ALL',
          items: t.items,
          product_id: '',
          category_id: t.categoryId,
          warehouse_id: warehouse,
          redirect_category_id: '',
          redirect_product_id: '',
          effective_from: LITE_EFFECTIVE_FROM,
          effective_to: LITE_EFFECTIVE_TO,
          status: true,
          module: 'LITE',
          created_by: 'admin1',
          updated_by: 'admin1',
        };

        rows.push(row);
        liteIndex++;
      }
    }
  }

  // =========================================================================
  // BLOCK 3: 169 HAATZA MOBILE ROWS (w0460–w0628)
  // Identical to HAATZA DESKTOP twins except widget_id and placement
  // =========================================================================
  for (let i = 0; i < haatzaDesktopRows.length; i++) {
    const desktopTwin = haatzaDesktopRows[i];
    const mobileWidgetNum = i + 1 + 459; // w0001 -> w0460, w0169 -> w0628
    const mobileWidgetId = `w${String(mobileWidgetNum).padStart(4, '0')}`;

    const mobileRow: DashboardSeedRow = {
      ...desktopTwin,
      widget_id: mobileWidgetId,
      placement: 'MOBILE',
    };

    rows.push(mobileRow);
  }

  return rows;
}

/**
 * Backward-compatible helper for legacy tests
 */
export function generate169DashboardRows(): DashboardSeedRow[] {
  return generate628DashboardRows().slice(0, 169);
}
