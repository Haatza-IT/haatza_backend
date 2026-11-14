import { z } from 'zod';
import { pinCodeSchema } from '../../common/validations/common.validation';
import { gstinSchema, panSchema } from '../../common/validations/tax.validation';

/**
 * Media item structure for product_images and promotional_images:
 * [ { "Image": "https://example.com/item.jpg", "Type": "image" | "video" } ]
 * Allows both images and videos.
 */
export const mediaItemSchema = z.object({
  Image: z.string().trim().url({ message: 'Media URL must be a valid URL' }),
  Type: z.enum(['image', 'video', 'IMAGE', 'VIDEO']).transform((val) => val.toLowerCase() as 'image' | 'video'),
});

export const promotionalImageItemSchema = mediaItemSchema;

/**
 * Product variant price structure:
 * [ { "variant": "Small", "price": 899 } ]
 * Integer whole rupees required.
 */
export const variantPriceItemSchema = z.object({
  variant: z.string().trim().min(1, { message: 'Variant name cannot be empty' }),
  price: z.number().int({ message: 'Variant price must be an integer (whole rupees)' }).nonnegative({ message: 'Variant price cannot be negative' }),
});

/**
 * Complete Zod schema for Product creation covering all 59 fields
 * and existing preserved fields.
 */
export const createProductSchema = z.object({
  // A. Product and Seller Information (1-18)
  sellerId: z.string().trim().min(1).optional().nullable(),
  categoryId: z.string().trim().min(1, { message: 'categoryId is required' }),
  productId: z.string().trim().uuid().optional(),
  productName: z.string().trim().optional(),
  // Also accept legacy "name" as fallback for productName
  name: z.string().trim().optional(),
  categoryName: z.string().trim().optional().nullable(),
  productCoverImage: z.string().trim().url({ message: 'Cover image must be a valid URL' }).optional().nullable(),
  productCoverImages: z.union([
    z.string().trim().url({ message: 'Cover image must be a valid URL' }),
    z.array(z.string().trim().url({ message: 'Each cover image must be a valid URL' })),
  ]).optional().nullable(),
  productImages: z.array(mediaItemSchema).optional().nullable(),
  sku: z.string().trim().max(100).optional().nullable(),
  shippingWeight: z.number().int({ message: 'Shipping weight must be an integer (grams)' }).nonnegative({ message: 'Shipping weight cannot be negative' }).optional().nullable(),
  brand: z.string().trim().max(100).optional().nullable(),
  status: z.boolean().optional().default(true),
  // Also accept legacy "isActive" as fallback for status
  isActive: z.boolean().optional(),
  productOptions: z.record(z.string(), z.array(z.string())).optional().nullable(),
  price: z.number().int({ message: 'Price must be an integer in whole rupees' }).nonnegative({ message: 'Price cannot be negative' }),
  productType: z.string().trim().optional().nullable(),
  discount: z.number().int({ message: 'Discount must be an integer (whole rupees or percentage)' }).nonnegative({ message: 'Discount cannot be negative' }).optional().nullable().default(0),
  manageVariants: z.boolean().optional().default(false),
  ribbon: z.string().trim().max(100).optional().nullable(),
  trackInventory: z.boolean().optional().default(true),
  variantPrice: z.array(variantPriceItemSchema).optional().nullable(),

  // B. Product Specifications and Images (19-29)
  productSpecification: z.record(z.string(), z.any()).optional().nullable(),
  influencerBranding: z.boolean().optional().default(false),
  activeAd: z.boolean().optional().default(false),
  subcategoryName: z.string().trim().optional().nullable(),
  subcategoryId: z.string().trim().optional().nullable(),
  haatzaVerified: z.boolean().optional().default(false),
  promotionalImages: z.array(promotionalImageItemSchema).optional().nullable(),
  paymentType: z.string().trim().optional().nullable(),
  returnPolicy: z.union([z.string().trim(), z.record(z.string(), z.any())]).optional().nullable(),
  deliveryCharges: z.boolean().optional().default(false),
  sizeChart: z.string().trim().url({ message: 'sizeChart must be a valid URL' }).optional().nullable(),

  // C. Marketing and Analytics (30-36)
  priorityScore: z.number().int().nonnegative().optional().default(0),
  averageCpc: z.number().int().nonnegative().optional().default(0),
  reach: z.number().int().nonnegative().optional().default(0),
  impression: z.number().int().nonnegative().optional().default(0),
  clicks: z.number().int().nonnegative().optional().default(0),
  sales: z.number().int().nonnegative().optional().default(0),
  revenue: z.number().int().nonnegative().optional().default(0),

  // D. Seller, GST and Business Information (37-48)
  sellerPincode: pinCodeSchema.optional().nullable(),
  isGstSeller: z.boolean().optional().default(false),
  searchKeyword: z.array(z.string().trim()).optional().nullable(),
  isSellerEarn: z.boolean().optional().default(false),
  sellAndEarnCommission: z.number().int().nonnegative().optional().default(0),
  isDomestic: z.boolean().optional().default(true),
  businessState: z.string().trim().optional().nullable(),
  businessStateCode: z.string().trim().max(10).optional().nullable(),
  salesTerritoryType: z.string().trim().optional().nullable(),
  businessRegistrationType: z.string().trim().optional().nullable(),
  gstNo: gstinSchema.optional().nullable(),
  panNumber: panSchema.optional().nullable(),

  // E. Pricing and Payment Information (49-53)
  codPrice: z.number().int().nonnegative().optional().nullable(),
  upi: z.union([z.string().trim(), z.number().transform(String)]).optional().nullable(),
  mrp: z.number().int().nonnegative().optional().nullable(),
  onSalePrice: z.number().int().nonnegative().optional().nullable(),
  upiPaymentDiscount: z.number().int().nonnegative().optional().nullable(),

  // F. Campaign, Category and Warehouse Information (54-59)
  campaignId: z.string().trim().optional().nullable(),
  similarCategoryId: z.string().trim().optional().nullable(),
  productHighlights: z.array(z.string().trim()).optional().nullable(),
  isHaatzaLite: z.boolean().optional().default(false),
  warehouseId: z.string().trim().optional().nullable(),
  warehousePincode: pinCodeSchema.optional().nullable(),

  // Preserved Existing Fields
  description: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  stock: z.number().int().nonnegative().optional().default(0),
})
.superRefine((data, ctx) => {
  if (!data.productName && !data.name) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'productName is required',
      path: ['productName'],
    });
  }
})
.transform((data) => {
  // Normalize legacy names if passed
  return {
    ...data,
    productName: (data.productName || data.name) as string,
    status: data.status !== undefined ? data.status : (data.isActive !== undefined ? data.isActive : true),
  };
});

/**
 * Zod schema for updating a product (all fields optional).
 */
export const updateProductSchema = z.object({
  // A. Product and Seller Information (1-18)
  sellerId: z.string().trim().min(1).optional().nullable(),
  categoryId: z.string().trim().min(1).optional(),
  productName: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  categoryName: z.string().trim().optional().nullable(),
  productCoverImage: z.string().trim().url().optional().nullable(),
  productCoverImages: z.union([
    z.string().trim().url(),
    z.array(z.string().trim().url()),
  ]).optional().nullable(),
  productImages: z.array(mediaItemSchema).optional().nullable(),
  sku: z.string().trim().max(100).optional().nullable(),
  shippingWeight: z.number().int().nonnegative().optional().nullable(),
  brand: z.string().trim().max(100).optional().nullable(),
  status: z.boolean().optional(),
  isActive: z.boolean().optional(),
  productOptions: z.record(z.string(), z.array(z.string())).optional().nullable(),
  price: z.number().int().nonnegative().optional(),
  productType: z.string().trim().optional().nullable(),
  discount: z.number().int().nonnegative().optional().nullable(),
  manageVariants: z.boolean().optional(),
  ribbon: z.string().trim().max(100).optional().nullable(),
  trackInventory: z.boolean().optional(),
  variantPrice: z.array(variantPriceItemSchema).optional().nullable(),

  // B. Product Specifications and Images (19-29)
  productSpecification: z.record(z.string(), z.any()).optional().nullable(),
  influencerBranding: z.boolean().optional(),
  activeAd: z.boolean().optional(),
  subcategoryName: z.string().trim().optional().nullable(),
  subcategoryId: z.string().trim().optional().nullable(),
  haatzaVerified: z.boolean().optional(),
  promotionalImages: z.array(promotionalImageItemSchema).optional().nullable(),
  paymentType: z.string().trim().optional().nullable(),
  returnPolicy: z.union([z.string().trim(), z.record(z.string(), z.any())]).optional().nullable(),
  deliveryCharges: z.boolean().optional(),
  sizeChart: z.string().trim().url().optional().nullable(),

  // C. Marketing and Analytics (30-36)
  priorityScore: z.number().int().nonnegative().optional(),
  averageCpc: z.number().int().nonnegative().optional(),
  reach: z.number().int().nonnegative().optional(),
  impression: z.number().int().nonnegative().optional(),
  clicks: z.number().int().nonnegative().optional(),
  sales: z.number().int().nonnegative().optional(),
  revenue: z.number().int().nonnegative().optional(),

  // D. Seller, GST and Business Information (37-48)
  sellerPincode: pinCodeSchema.optional().nullable(),
  isGstSeller: z.boolean().optional(),
  searchKeyword: z.array(z.string().trim()).optional().nullable(),
  isSellerEarn: z.boolean().optional(),
  sellAndEarnCommission: z.number().int().nonnegative().optional(),
  isDomestic: z.boolean().optional(),
  businessState: z.string().trim().optional().nullable(),
  businessStateCode: z.string().trim().max(10).optional().nullable(),
  salesTerritoryType: z.string().trim().optional().nullable(),
  businessRegistrationType: z.string().trim().optional().nullable(),
  gstNo: gstinSchema.optional().nullable(),
  panNumber: panSchema.optional().nullable(),

  // E. Pricing and Payment Information (49-53)
  codPrice: z.number().int().nonnegative().optional().nullable(),
  upi: z.union([z.string().trim(), z.number().transform(String)]).optional().nullable(),
  mrp: z.number().int().nonnegative().optional().nullable(),
  onSalePrice: z.number().int().nonnegative().optional().nullable(),
  upiPaymentDiscount: z.number().int().nonnegative().optional().nullable(),

  // F. Campaign, Category and Warehouse Information (54-59)
  campaignId: z.string().trim().optional().nullable(),
  similarCategoryId: z.string().trim().optional().nullable(),
  productHighlights: z.array(z.string().trim()).optional().nullable(),
  isHaatzaLite: z.boolean().optional(),
  warehouseId: z.string().trim().optional().nullable(),
  warehousePincode: pinCodeSchema.optional().nullable(),

  // Preserved Existing Fields
  description: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  stock: z.number().int().nonnegative().optional(),
}).transform((data) => {
  const result: any = { ...data };
  if (data.name && !data.productName) {
    result.productName = data.name;
  }
  if (data.isActive !== undefined && data.status === undefined) {
    result.status = data.isActive;
  }
  delete result.name;
  delete result.isActive;
  return result;
});

/**
 * Query filters for Product listing and search.
 */
export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  subcategoryId: z.string().trim().optional(),
  sellerId: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  status: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  isHaatzaLite: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
  haatzaVerified: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
  sortBy: z.enum(['productId', 'price', 'productName', 'priorityScore', 'sales', 'createdAt']).optional().default('productId'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
