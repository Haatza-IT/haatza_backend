import { z } from 'zod';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  promotionalImageItemSchema,
  variantPriceItemSchema,
} from './products.schema';

export type PromotionalImageItem = z.infer<typeof promotionalImageItemSchema>;
export type VariantPriceItem = z.infer<typeof variantPriceItemSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;

/**
 * Publicly safe seller details attached to a product response.
 * Sensitive data (passwords, bank accounts, internal IDs) is explicitly excluded.
 */
export interface PublicSellerSummary {
  sellerId: string;
  name: string;
  companyName?: string | null;
  city?: string | null;
  state?: string | null;
}

/**
 * Serialized Product object including all 59 fields and preserved fields.
 */
export interface SerializedProduct {
  // A. Product and Seller Information (1-18)
  sellerId: string | null;
  categoryId: string;
  productId: string;
  id: string; // Legacy alias matching productId
  productName: string;
  name: string; // Legacy alias matching productName
  categoryName: string | null;
  productCoverImages: string[] | any;
  sku: string | null;
  shippingWeight: number | null;
  brand: string | null;
  status: boolean;
  isActive: boolean; // Legacy alias matching status
  productOptions: Record<string, string[]> | any;
  price: number;
  productType: string | null;
  discount: number | null;
  manageVariants: boolean;
  ribbon: string | null;
  trackInventory: boolean;
  variantPrice: VariantPriceItem[] | any;

  // B. Product Specifications and Images (19-29)
  productSpecification: Record<string, any> | any;
  influencerBranding: boolean;
  activeAd: boolean;
  subcategoryName: string | null;
  subcategoryId: string | null;
  haatzaVerified: boolean;
  promotionalImages: PromotionalImageItem[] | any;
  paymentType: string | null;
  returnPolicy: any;
  deliveryCharges: boolean;
  sizeChart: string | null;

  // C. Marketing and Analytics (30-36)
  priorityScore: number;
  averageCpc: number;
  reach: number;
  impression: number;
  clicks: number;
  sales: number;
  revenue: number;

  // D. Seller, GST and Business Information (37-48)
  sellerPincode: string | null;
  isGstSeller: boolean;
  searchKeyword: string[] | any;
  isSellerEarn: boolean;
  sellAndEarnCommission: number;
  isDomestic: boolean;
  businessState: string | null;
  businessStateCode: string | null;
  salesTerritoryType: string | null;
  businessRegistrationType: string | null;
  gstNo: string | null;
  panNumber: string | null;

  // E. Pricing and Payment Information (49-53)
  codPrice: number | null;
  upi: number | null;
  mrp: number | null;
  onSalePrice: number | null;
  upiPaymentDiscount: number | null;

  // F. Campaign, Category and Warehouse Information (54-59)
  campaignId: string | null;
  similarCategoryId: string | null;
  productHighlights: string[] | any;
  isHaatzaLite: boolean;
  warehouseId: string | null;
  warehousePincode: string | null;

  // Preserved Existing Fields
  description: string | null;
  image: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations (Safe presentation)
  category?: {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
  } | null;
  seller?: PublicSellerSummary | null;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: SerializedProduct;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: {
    items: SerializedProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

