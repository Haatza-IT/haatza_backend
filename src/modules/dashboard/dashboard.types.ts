/**
 * Dashboard Types and DTO Interfaces
 * Supports the 18-column widget configuration architecture with JSONB items.
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
  subtitle?: string | null;
  badge?: string | null;
  image_url: string;
  button_text?: string | null;
  redirect_type: RedirectType;
  redirect_url: string;
}

export interface CategoryItem {
  category_id: string;
  category_name: string;
  slug: string;
  category_image: string | null;
  redirect_type: 'CATEGORY';
  redirect_url: string;
}

export interface ProductItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  category_id: string;
  category_name: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  brand: string | null;
  price: number;
  mrp: number | null;
  discount: number;
  onsale_price: number | null;
  ribbon: string | null;
  is_haatzalite: boolean;
  haatza_verified: boolean;
  redirect_type: 'PRODUCT';
  redirect_url: string;
}

export type ResolvedWidgetItem =
  | BannerItem
  | CategoryItem
  | ProductItem
  | Record<string, any>;

export interface DashboardWidget {
  widget_id: string;
  widget_name: string;
  widget_redirect_to: string | null;
  placement: string | null;
  sequence: number | null;
  territory: string | null;
  items: any[];
  product_id: string | null;
  category_id: string | null;
  warehouse_id: string | null;
  redirect_category_id: string | null;
  redirect_product_id: string | null;
  effective_from: string | null;
  effective_to: string | null;
  status: boolean;
  module: string | null;
  created_by: string | null;
  updated_by: string | null;
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
  warehouse_id?: string;
  sequence?: number | string;
  status?: boolean | string;
  active_only?: boolean | string;
  search?: string;
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
  widget_redirect_to: string | null;
  placement: string | null;
  sequence: number | null;
  territory: string | null;
  module: string | null;
  warehouse_id?: string | null;
  category_id?: string | null;
  product_id?: string | null;
  redirect_category_id?: string | null;
  redirect_product_id?: string | null;
  effective_from: string | null;
  effective_to: string | null;
  status: boolean;
  items: ResolvedWidgetItem[];
  total_items: number;
  dependency_status?: string;
  dependency_name?: string;
  message?: string;
}

export interface CustomerDashboardResponse {
  success: boolean;
  module: 'SHOPPING' | 'LITE';
  placement: string;
  territory?: string;
  total_widgets: number;
  data: ResolvedWidget[];
  widgets: ResolvedWidget[];
}
