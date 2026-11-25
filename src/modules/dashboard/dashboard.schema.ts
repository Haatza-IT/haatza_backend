import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import {
  ALLOWED_PLACEMENTS,
  isAllowedPlacement,
  type AllowedPlacement,
  INDIAN_STATE_CODES,
  isIndianStateCode,
  type IndianStateCode,
  LITE_WAREHOUSES,
  isLiteWarehouseId,
  PAGINATION_DEFAULTS,
} from './dashboard.config';

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
 * Create Dashboard Widget Zod Schema (Accepts any valid row widget_id)
 */
export const createDashboardSchema = z
  .object({
    widget_id: z.string().trim().min(1, 'widget_id is required').optional(),
    widget_name: z.string().trim().min(1, 'widget_name is required').optional(),
    widget_redirect_to: z.string().trim().optional().nullable(),
    placement: z.enum(ALLOWED_PLACEMENTS).optional().nullable(),
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

    // Legacy fallback support
    Widget_id: z.string().trim().optional(),
    Widget_name: z.string().trim().optional(),
    Redirected_to: z.string().trim().optional().nullable(),
    Placement: z.enum(ALLOWED_PLACEMENTS).optional().nullable(),
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
      widget_redirect_to: (data.widget_redirect_to ?? data.Redirected_to)?.trim() || '',
      placement: (data.placement ?? data.Placement)?.trim() || ALLOWED_PLACEMENTS[0],
      sequence:
        data.sequence !== undefined && data.sequence !== null
          ? Number(data.sequence)
          : data.Sequence !== undefined && data.Sequence !== null
            ? Number(data.Sequence)
            : 0,
      territory: (data.territory ?? data.Territory)?.trim() || '56',
      items: data.items && data.items.length > 0 ? data.items : data.Items ?? [],
      product_id: (data.product_id ?? data.Product_Id)?.trim() || '',
      category_id: (data.category_id ?? data.Category_Id)?.trim() || '',
      warehouse_id: data.warehouse_id?.trim() || '',
      redirect_category_id: data.redirect_category_id?.trim() || '',
      redirect_product_id: data.redirect_product_id?.trim() || '',
      effective_from: data.effective_from ?? null,
      effective_to: data.effective_to ?? null,
      status: data.status ?? true,
      module: data.module?.trim() || 'HAATZA',
      created_by: data.created_by?.trim() || 'admin1',
      updated_by: data.updated_by?.trim() || 'admin1',
    };
  });

export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;

/**
 * Update Dashboard Widget Zod Schema
 */
export const updateDashboardSchema = z
  .object({
    widget_id: z.string().trim().optional(),
    widget_name: z.string().trim().min(1, 'widget_name cannot be empty').optional(),
    widget_redirect_to: z.string().trim().optional().nullable(),
    placement: z.enum(ALLOWED_PLACEMENTS).optional().nullable(),
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

    // Legacy fallback support
    Widget_id: z.string().trim().optional(),
    Widget_name: z.string().trim().optional(),
    Redirected_to: z.string().trim().optional().nullable(),
    Placement: z.enum(ALLOWED_PLACEMENTS).optional().nullable(),
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
 * Strict validator for optional customer pagination parameters:
 * - opt-in: if neither page nor limit is sent, returns {} (unpaginated)
 * - if page and/or limit is sent: page defaults to 1, limit defaults to 20
 * - limit alone is allowed (page defaults to 1)
 * - invalid page/limit (0, negative, decimal, text, empty, limit > 50, duplicate array): 400
 */
export function validatePaginationParams(rawPage: any, rawLimit: any): { page?: number; limit?: number } {
  if (Array.isArray(rawPage)) {
    throw new BadRequestException('page parameter cannot be duplicated');
  }
  if (Array.isArray(rawLimit)) {
    throw new BadRequestException('limit parameter cannot be duplicated');
  }

  const hasPage = rawPage !== undefined && rawPage !== null && String(rawPage).trim() !== '';
  const hasLimit = rawLimit !== undefined && rawLimit !== null && String(rawLimit).trim() !== '';

  if (rawPage !== undefined && !hasPage) {
    throw new BadRequestException('page must be an integer >= 1');
  }
  if (rawLimit !== undefined && !hasLimit) {
    throw new BadRequestException('limit must be an integer between 1 and 50');
  }

  // "No params" branch: if NEITHER page NOR limit is sent, return empty object (opt-in pagination)
  if (!hasPage && !hasLimit) {
    return {};
  }

  let pageNum: number = PAGINATION_DEFAULTS.DEFAULT_PAGE;
  if (hasPage) {
    if (typeof rawPage === 'number') {
      if (!Number.isInteger(rawPage) || rawPage < 1) {
        throw new BadRequestException('page must be an integer >= 1');
      }
      pageNum = rawPage;
    } else if (typeof rawPage === 'string') {
      const trimmed = rawPage.trim();
      if (!/^[1-9]\d*$/.test(trimmed)) {
        throw new BadRequestException('page must be an integer >= 1');
      }
      pageNum = parseInt(trimmed, 10);
    } else {
      throw new BadRequestException('page must be an integer >= 1');
    }
  }

  let limitNum: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT;
  if (hasLimit) {
    if (typeof rawLimit === 'number') {
      if (!Number.isInteger(rawLimit) || rawLimit < PAGINATION_DEFAULTS.MIN_LIMIT || rawLimit > PAGINATION_DEFAULTS.MAX_LIMIT) {
        throw new BadRequestException(`limit must be an integer between ${PAGINATION_DEFAULTS.MIN_LIMIT} and ${PAGINATION_DEFAULTS.MAX_LIMIT}`);
      }
      limitNum = rawLimit;
    } else if (typeof rawLimit === 'string') {
      const trimmed = rawLimit.trim();
      if (!/^[1-9]\d*$/.test(trimmed)) {
        throw new BadRequestException(`limit must be an integer between ${PAGINATION_DEFAULTS.MIN_LIMIT} and ${PAGINATION_DEFAULTS.MAX_LIMIT}`);
      }
      limitNum = parseInt(trimmed, 10);
      if (limitNum < PAGINATION_DEFAULTS.MIN_LIMIT || limitNum > PAGINATION_DEFAULTS.MAX_LIMIT) {
        throw new BadRequestException(`limit must be an integer between ${PAGINATION_DEFAULTS.MIN_LIMIT} and ${PAGINATION_DEFAULTS.MAX_LIMIT}`);
      }
    } else {
      throw new BadRequestException(`limit must be an integer between ${PAGINATION_DEFAULTS.MIN_LIMIT} and ${PAGINATION_DEFAULTS.MAX_LIMIT}`);
    }
  }

  return { page: pageNum, limit: limitNum };
}

/**
 * Strict Customer Dashboard Query Schema
 * Validates requirements before hitting cache or database:
 * - module must be HAATZA or LITE
 * - categoryId must be present
 * - territory must be present and a valid Indian state code
 * - For LITE, warehouseId must be present
 * - page & limit: optional pagination for "Category Products"
 */
export const customerDashboardQuerySchema = z
  .object({
    module: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    category_id: z.string().trim().optional(),
    territory: z.string().trim().optional(),
    placement: z.string().trim().optional(),
    warehouseId: z.string().trim().optional(),
    warehouse_id: z.string().trim().optional(),
    raw: z
      .union([
        z.boolean(),
        z.string().transform((v) => v.toLowerCase() === 'true' || v === '1'),
      ])
      .optional(),
    limit: z.any().optional(),
    skip: z.any().optional(),
    page: z.any().optional(),
    sequence: z.any().optional(),
    status: z
      .union([
        z.boolean(),
        z.string().transform((v) => v.toLowerCase() === 'true' || v === '1'),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    // If raw=true is set, this is an admin/CMS request, skip customer strict requirements
    if (data.raw) {
      return;
    }

    // 1. module check (mandatory for customer requests)
    const rawMod = (data.module || '').trim();
    if (!rawMod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['module'],
        message: "module is required. Allowed values: 'HAATZA', 'LITE'",
      });
      return;
    }

    const mod = rawMod.toUpperCase();
    if (mod !== 'HAATZA' && mod !== 'LITE') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['module'],
        message: `module must be either 'HAATZA' or 'LITE'. Received: '${data.module}'`,
      });
      return;
    }

    // 2. placement check (mandatory for BOTH HAATZA and LITE)
    const rawPlc = data.placement;
    const plc = (rawPlc || '').trim();
    if (!plc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['placement'],
        message: `placement is required. Allowed values: ${ALLOWED_PLACEMENTS.map((p) => `'${p}'`).join(', ')}`,
      });
    } else if (!isAllowedPlacement(plc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['placement'],
        message: `placement must be either 'DESKTOP' or 'MOBILE'. Received: '${rawPlc}'`,
      });
    }

    // 3. categoryId check
    const catId = (data.categoryId || data.category_id || '').trim();
    if (!catId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'categoryId is required and must not be empty',
      });
    }

    // 4. territory check (must be one of the 28 Indian state codes) - HAATZA only
    if (mod === 'HAATZA') {
      const rawTerr = data.territory;
      if (!rawTerr || rawTerr.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['territory'],
          message: 'territory is required. Must be one of the 28 supported Indian state codes.',
        });
      } else {
        const terr = rawTerr.trim();
        if (rawTerr !== terr || !isIndianStateCode(terr)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['territory'],
            message: `territory must be a valid 2-letter uppercase Indian state code. Received: '${rawTerr}'`,
          });
        }
      }
    }

    // 5. warehouseId check for LITE
    if (mod === 'LITE') {
      const whId = (data.warehouseId || data.warehouse_id || '').trim();
      if (!whId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['warehouseId'],
          message: 'warehouseId is required for LITE module',
        });
      } else if (!isLiteWarehouseId(whId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['warehouseId'],
          message: `warehouseId must be one of: ${LITE_WAREHOUSES.join(', ')}. Received: '${whId}'`,
        });
      }
    }

    // 6. Pagination check: page and limit
    if (data.page !== undefined || data.limit !== undefined) {
      try {
        validatePaginationParams(data.page, data.limit);
      } catch (err: any) {
        const errorPath = err.message.toLowerCase().includes('limit') ? 'limit' : 'page';
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [errorPath],
          message: err.message,
        });
      }
    }
  })
  .transform((data) => {
    let pageNum: number | undefined;
    let limitNum: number | undefined;
    if (!data.raw) {
      try {
        const pag = validatePaginationParams(data.page, data.limit);
        pageNum = pag.page;
        limitNum = pag.limit;
      } catch {
        // Handled in superRefine
      }
    }

    const mod = (data.module || '').toUpperCase();

    return {
      module: mod as 'HAATZA' | 'LITE',
      categoryId: (data.categoryId || data.category_id || '').trim(),
      territory: mod === 'HAATZA' || data.raw ? (data.territory ? String(data.territory).trim() : undefined) : undefined,
      placement: (data.placement || '').trim() as AllowedPlacement,
      warehouseId: (data.warehouseId || data.warehouse_id || '').trim(),
      raw: Boolean(data.raw),
      limit: limitNum,
      skip: data.skip,
      page: pageNum,
      sequence: data.sequence,
      status: data.status,
    };
  });

export type CustomerDashboardQueryInput = z.infer<typeof customerDashboardQuerySchema>;

/**
 * General / Admin Dashboard Query Schema
 */
export const dashboardQuerySchema = customerDashboardQuerySchema;
export type DashboardQueryInput = CustomerDashboardQueryInput;
