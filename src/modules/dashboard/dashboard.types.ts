/**
 * Dashboard Types and DTO Interfaces
 * Supports the 18-column widget configuration architecture with JSONB items.
 * Guaranteed zero null values across all customer responses.
 */

export type RedirectType = 'CATEGORY' | 'PRODUCT' | 'CAMPAIGN' | 'EXTERNAL';

export type WidgetType =
  | 'BANNER'
  | 'CATEGORY'
  | 'PRODUCT_LIST'
  | 'PERSONALIZED'
  | 'CUSTOM';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  image_url: string; // legacy alias
  buttonText: string;
  button_text: string; // legacy alias
  redirectType: RedirectType;
  redirect_type: RedirectType; // legacy alias
  redirectUrl: string;
  redirect_url: string; // legacy alias
}

export interface CategoryItem {
  categoryId: string;
  category_id: string; // legacy alias
  categoryName: string;
  category_name: string; // legacy alias
  slug: string;
  categoryImage: string;
  category_image: string; // legacy alias
  redirectType: 'CATEGORY';
  redirect_type: 'CATEGORY'; // legacy alias
  redirectUrl: string;
  redirect_url: string; // legacy alias
}

export interface ProductItem {
  productId: string;
  product_id: string; // legacy alias
  productName: string;
  product_name: string; // legacy alias
  description: string;
  productImage: string;
  product_image: string; // legacy alias
  categoryId: string;
  category_id: string; // legacy alias
  categoryName: string;
  category_name: string; // legacy alias
  subcategoryId: string;
  subcategory_id: string; // legacy alias
  subcategoryName: string;
  subcategory_name: string; // legacy alias
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  onSalePrice: number;
  onsale_price: number; // legacy alias
  currency: string;
  isAddToCart: boolean;
  ribbon: string;
  isHaatzaLite: boolean;
  is_haatzalite: boolean; // legacy alias
  haatzaVerified: boolean;
  haatza_verified: boolean; // legacy alias
  redirectType: 'PRODUCT';
  redirect_type: 'PRODUCT'; // legacy alias
  redirectUrl: string;
  redirect_url: string; // legacy alias

  // Extended product card fields for frontend compatibility
  id: string;
  name: string;
  mainImage: string;
  productCoverImage: string;
  sku: string;
  shippingWeight: number;
  status: boolean;
  productOptions: any[];
  productType: string;
  manageVariants: boolean;
  trackInventory: boolean;
  variantPrice: number;
  productSpecification: Record<string, string>;
  influencerBranding: boolean;
  activeAdd: boolean;
  promotionalImages: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  discountPercentage: number;
}

export type ResolvedWidgetItem =
  | BannerItem
  | CategoryItem
  | ProductItem
  | Record<string, any>;

export interface DashboardWidget {
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
  effective_from?: string;
  effective_to?: string;
  status: boolean;
  module: string;
  created_by: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDashboardDto {
  widget_id: string;
  widget_name: string;
  widget_redirect_to?: string | null;
  placement?: string | null;
  sequence?: number | null;
  territory?: string | null;
  items?: any[];
  product_id?: string | null;
  category_id?: string | null;
  warehouse_id?: string | null;
  redirect_category_id?: string | null;
  redirect_product_id?: string | null;
  effective_from?: string | Date | null;
  effective_to?: string | Date | null;
  status?: boolean;
  module?: string | null;
  created_by?: string | null;
  updated_by?: string | null;

  // Fallback mappings for legacy/alternate casing
  Widget_id?: string;
  Widget_name?: string;
  Redirected_to?: string | null;
  Placement?: string | null;
  Sequence?: number | null;
  Territory?: string | null;
  Items?: any[];
  Product_Id?: string | null;
  Category_Id?: string | null;
}

export interface UpdateDashboardDto {
  widget_id?: string;
  widget_name?: string;
  widget_redirect_to?: string | null;
  placement?: string | null;
  sequence?: number | null;
  territory?: string | null;
  items?: any[];
  product_id?: string | null;
  category_id?: string | null;
  warehouse_id?: string | null;
  redirect_category_id?: string | null;
  redirect_product_id?: string | null;
  effective_from?: string | Date | null;
  effective_to?: string | Date | null;
  status?: boolean;
  module?: string | null;
  created_by?: string | null;
  updated_by?: string | null;

  // Fallback mappings for legacy/alternate casing
  Widget_id?: string;
  Widget_name?: string;
  Redirected_to?: string | null;
  Placement?: string | null;
  Sequence?: number | null;
  Territory?: string | null;
  Items?: any[];
  Product_Id?: string | null;
  Category_Id?: string | null;
}

export interface DashboardQueryDto {
  page?: number;
  limit?: number;
  module?: string;
  placement?: string;
  territory?: string;
  warehouseId?: string;
  warehouse_id?: string;
  categoryId?: string;
  category_id?: string;
  sequence?: number | string;
  status?: boolean | string;
  active_only?: boolean | string;
  search?: string;
  raw?: boolean;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardWidget;
  message?: string;
}

export interface DashboardListResponse {
  success: boolean;
  data: DashboardWidget[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResolvedWidget {
  widget_id: string; // W001 through W023
  widget_name: string;
  widget_type: WidgetType;
  widget_redirect_to: string;
  placement: string;
  sequence: number;
  territory: string;
  module: string;
  warehouse_id: string;
  category_id: string;
  product_id: string;
  redirect_category_id: string;
  redirect_product_id: string;
  status: boolean;
  items: ResolvedWidgetItem[];
  total_items: number;
  dependency_status?: string;
  dependency_name?: string;
  message?: string;
}

export interface CustomerDashboardResponse {
  success: boolean;
  module: string; // 'HAATZA' | 'LITE' | 'SHOPPING'
  placement: string;
  territory: string;
  warehouseId: string;
  total_widgets: number;
  data: ResolvedWidget[];
  widgets: ResolvedWidget[];
}
