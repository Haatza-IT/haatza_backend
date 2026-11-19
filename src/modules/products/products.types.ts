import { z } from 'zod';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  mediaItemSchema,
  promotionalImageItemSchema,
  variantPriceItemSchema,
} from './products.schema';

export type MediaItem = z.infer<typeof mediaItemSchema>;
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
  companyName: string;
  city: string;
  state: string;
}

/**
 * Serialized Product object including all 59 fields and preserved fields.
 */
export interface SerializedProduct {
  // A. Product and Seller Information (1-18)
  sellerId: string;
  categoryId: string;
  productId: string;
  id: string; // Legacy alias matching productId
  productName: string;
  name: string; // Legacy alias matching productName
  categoryName: string;
  productCoverImage: string;
  productCoverImages: string[]; // Legacy alias returning [productCoverImage]
  productImages: MediaItem[] | any[];
  sku: string;
  shippingWeight: number;
  brand: string;
  status: boolean;
  isActive: boolean; // Legacy alias matching status
  productOptions: Record<string, string[]> | any;
  price: number;
  productType: string;
  discount: number;
  manageVariants: boolean;
  ribbon: string;
  trackInventory: boolean;
  variantPrice: VariantPriceItem[] | any[];

  // B. Product Specifications and Images (19-29)
  productSpecification: Record<string, any>;
  influencerBranding: boolean;
  activeAd: boolean;
  subcategoryName: string;
  subcategoryId: string;
  haatzaVerified: boolean;
  promotionalImages: PromotionalImageItem[] | any[];
  paymentType: string;
  returnPolicy: any;
  deliveryCharges: boolean;
  sizeChart: string;

  // C. Marketing and Analytics (30-36)
  priorityScore: number;
  averageCpc: number;
  reach: number;
  impression: number;
  clicks: number;
  sales: number;
  revenue: number;

  // D. Seller, GST and Business Information (37-48)
  sellerPincode: string;
  isGstSeller: boolean;
  searchKeyword: string[];
  isSellerEarn: boolean;
  sellAndEarnCommission: number;
  isDomestic: boolean;
  businessState: string;
  businessStateCode: string;
  salesTerritoryType: string;
  businessRegistrationType: string;
  gstNo: string;
  panNumber: string;

  // E. Pricing and Payment Information (49-53)
  codPrice: number;
  upi: string;
  mrp: number;
  onSalePrice: number;
  upiPaymentDiscount: number;

  // F. Campaign, Category and Warehouse Information (54-59)
  campaignId: string;
  similarCategoryId: string;
  productHighlights: string[];
  isHaatzaLite: boolean;
  warehouseId: string;
  warehousePincode: string;

  // Preserved Existing Fields
  description: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;

  // Relations (Safe presentation)
  category?: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
  seller?: PublicSellerSummary;
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

