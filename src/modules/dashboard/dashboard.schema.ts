import { z } from 'zod';

/**
 * Items validator: accepts a JSON array (PostgreSQL JSONB), or a JSON string parsed into an array.
 * Defaults to empty array [].
 */
export const itemsInputSchema = z
  .union([
    z.array(z.any()),
    z.string().transform((val, ctx) => {
      const trimmed = val.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Items must be a valid JSON array',
        });
        return z.NEVER;
      }
    }),
  ])
  .default([]);

/**
 * Sequence validator: integer sequence.
 */
export const sequenceInputSchema = z
  .union([
    z.number().int(),
    z.string().trim().regex(/^-?\d+$/, 'Sequence must be an integer').transform((v) => parseInt(v, 10)),
  ])
  .optional()
  .nullable();

/**
 * Boolean input validator: accepts boolean or string 'true'/'false'.
 */
export const booleanInputSchema = z
  .union([
    z.boolean(),
    z.string().trim().transform((val) => {
      if (val.toLowerCase() === 'true' || val === '1') return true;
      if (val.toLowerCase() === 'false' || val === '0') return false;
      return true;
    }),
  ])
  .default(true);

/**
 * Timestamp input validator: accepts ISO date string, Date object, or null.
 */
export const timestampInputSchema = z
  .union([
    z.date(),
    z.string().trim().datetime({ offset: true }).transform((val) => new Date(val)),
    z.string().trim().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, 'Invalid date format').transform((val) => new Date(val)),
  ])
  .optional()
  .nullable();

/**
 * Create Dashboard Widget Zod Schema (18 columns)
 */
export const createDashboardSchema = z
  .object({
    widget_id: z.string().trim().min(1, 'widget_id is required').optional(),
    widget_name: z.string().trim().min(1, 'widget_name is required').optional(),
    widget_redirect_to: z.string().trim().optional().nullable(),
    placement: z.string().trim().optional().nullable(),
    sequence: sequenceInputSchema,
    territory: z.string().trim().optional().nullable(),
    items: itemsInputSchema,
    product_id: z.string().trim().optional().nullable(),
    category_id: z.string().trim().optional().nullable(),
    warehouse_id: z.string().trim().optional().nullable(),
    redirect_category_id: z.string().trim().optional().nullable(),
    redirect_product_id: z.string().trim().optional().nullable(),
    effective_from: timestampInputSchema,
    effective_to: timestampInputSchema,
    status: booleanInputSchema,
    module: z.string().trim().optional().nullable(),
    created_by: z.string().trim().optional().nullable(),
    updated_by: z.string().trim().optional().nullable(),

    // Legacy / PascalCase fallback support
    Widget_id: z.string().trim().optional(),
    Widget_name: z.string().trim().optional(),
    Redirected_to: z.string().trim().optional().nullable(),
    Placement: z.string().trim().optional().nullable(),
    Sequence: sequenceInputSchema,
    Territory: z.string().trim().optional().nullable(),
    Items: itemsInputSchema.optional(),
    Product_Id: z.string().trim().optional().nullable(),
    Category_Id: z.string().trim().optional().nullable(),
  })
  .transform((data, ctx) => {
    const finalWidgetId = data.widget_id || data.Widget_id;
    const finalWidgetName = data.widget_name || data.Widget_name;

    if (!finalWidgetId || !finalWidgetId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['widget_id'],
        message: 'widget_id is required',
      });
    }

    if (!finalWidgetName || !finalWidgetName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['widget_name'],
        message: 'widget_name is required',
      });
    }

    return {
      widget_id: finalWidgetId ? finalWidgetId.trim() : '',
      widget_name: finalWidgetName ? finalWidgetName.trim() : '',
      widget_redirect_to: data.widget_redirect_to ?? data.Redirected_to ?? null,
      placement: data.placement ?? data.Placement ?? null,
      sequence: data.sequence ?? data.Sequence ?? null,
      territory: data.territory ?? data.Territory ?? null,
      items: data.items && data.items.length > 0 ? data.items : (data.Items ?? []),
      product_id: data.product_id ?? data.Product_Id ?? null,
      category_id: data.category_id ?? data.Category_Id ?? null,
      warehouse_id: data.warehouse_id ?? null,
      redirect_category_id: data.redirect_category_id ?? null,
      redirect_product_id: data.redirect_product_id ?? null,
      effective_from: data.effective_from ?? null,
      effective_to: data.effective_to ?? null,
      status: data.status ?? true,
      module: data.module ?? null,
      created_by: data.created_by ?? null,
      updated_by: data.updated_by ?? null,
    };
  });

export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;

/**
 * Update Dashboard Widget Zod Schema (18 columns)
 */
export const updateDashboardSchema = z
  .object({
    widget_id: z.string().trim().optional(),
    widget_name: z.string().trim().min(1, 'widget_name cannot be empty').optional(),
    widget_redirect_to: z.string().trim().optional().nullable(),
    placement: z.string().trim().optional().nullable(),
    sequence: sequenceInputSchema,
    territory: z.string().trim().optional().nullable(),
    items: z.array(z.any()).optional(),
    product_id: z.string().trim().optional().nullable(),
    category_id: z.string().trim().optional().nullable(),
    warehouse_id: z.string().trim().optional().nullable(),
    redirect_category_id: z.string().trim().optional().nullable(),
    redirect_product_id: z.string().trim().optional().nullable(),
    effective_from: timestampInputSchema,
    effective_to: timestampInputSchema,
    status: z.union([z.boolean(), z.string().transform((v) => v.toLowerCase() === 'true')]).optional(),
    module: z.string().trim().optional().nullable(),
    created_by: z.string().trim().optional().nullable(),
    updated_by: z.string().trim().optional().nullable(),

    // Legacy / PascalCase fallback support
    Widget_id: z.string().trim().optional(),
    Widget_name: z.string().trim().optional(),
    Redirected_to: z.string().trim().optional().nullable(),
    Placement: z.string().trim().optional().nullable(),
    Sequence: sequenceInputSchema,
    Territory: z.string().trim().optional().nullable(),
    Items: z.array(z.any()).optional(),
    Product_Id: z.string().trim().optional().nullable(),
    Category_Id: z.string().trim().optional().nullable(),
  })
  .transform((data) => ({
    widget_id: data.widget_id ?? data.Widget_id,
    widget_name: data.widget_name ?? data.Widget_name,
    widget_redirect_to: data.widget_redirect_to ?? data.Redirected_to,
    placement: data.placement ?? data.Placement,
    sequence: data.sequence ?? data.Sequence,
    territory: data.territory ?? data.Territory,
    items: data.items ?? data.Items,
    product_id: data.product_id ?? data.Product_Id,
    category_id: data.category_id ?? data.Category_Id,
    warehouse_id: data.warehouse_id,
    redirect_category_id: data.redirect_category_id,
    redirect_product_id: data.redirect_product_id,
    effective_from: data.effective_from,
    effective_to: data.effective_to,
    status: data.status,
    module: data.module,
    created_by: data.created_by,
    updated_by: data.updated_by,
  }));

export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;

/**
 * Query parameters Zod Schema for listing dashboard widgets.
 */
export const dashboardQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  module: z.string().trim().optional(),
  placement: z.string().trim().optional(),
  territory: z.string().trim().optional(),
  warehouseId: z.string().trim().optional(),
  warehouse_id: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  category_id: z.string().trim().optional(),
  sequence: z.coerce.number().int().optional(),
  status: z
    .string()
    .trim()
    .transform((v) => (v.toLowerCase() === 'true' ? true : v.toLowerCase() === 'false' ? false : undefined))
    .optional(),
  active_only: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase() === 'true' || v === '1')
    .optional(),
  search: z.string().trim().optional(),
  raw: z
    .union([
      z.boolean(),
      z.string().transform((v) => v.toLowerCase() === 'true' || v === '1'),
    ])
    .optional(),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
