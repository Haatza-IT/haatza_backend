import { z } from 'zod';

/**
 * Items validator: accepts a string array (PostgreSQL TEXT[]), or single string converted to array.
 * Defaults to empty array [].
 */
export const itemsInputSchema = z
  .union([
    z.array(z.string()),
    z.string().transform((val) => {
      const trimmed = val.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
        } catch {
          return [trimmed];
        }
      }
      return [trimmed];
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
 * Create Dashboard Widget Zod Schema
 */
export const createDashboardSchema = z.object({
  Widget_id: z
    .string()
    .trim()
    .min(1, 'Widget_id is required'),
  Widget_name: z
    .string()
    .trim()
    .min(1, 'Widget_name is required'),
  Redirected_to: z.string().trim().optional().nullable(),
  Placement: z.string().trim().optional().nullable(),
  Sequence: sequenceInputSchema,
  Territory: z.string().trim().optional().nullable(),
  Items: itemsInputSchema,
  Product_Id: z.string().trim().optional().nullable(),
  Category_Id: z.string().trim().optional().nullable(),
});

export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;

/**
 * Update Dashboard Widget Zod Schema
 */
export const updateDashboardSchema = z.object({
  Widget_id: z.string().trim().optional(),
  Widget_name: z.string().trim().min(1, 'Widget_name cannot be empty').optional(),
  Redirected_to: z.string().trim().optional().nullable(),
  Placement: z.string().trim().optional().nullable(),
  Sequence: sequenceInputSchema,
  Territory: z.string().trim().optional().nullable(),
  Items: itemsInputSchema.optional(),
  Product_Id: z.string().trim().optional().nullable(),
  Category_Id: z.string().trim().optional().nullable(),
});

export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;

/**
 * Query parameters Zod Schema for listing dashboard widgets.
 */
export const dashboardQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  placement: z.string().trim().optional(),
  territory: z.string().trim().optional(),
  sequence: z.coerce.number().int().optional(),
  search: z.string().trim().optional(),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
