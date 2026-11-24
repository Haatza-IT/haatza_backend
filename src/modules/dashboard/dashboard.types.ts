/**
 * Dashboard Types and DTO Interfaces
 * Supports the unified Dashboard API with JSONB items and zero null values.
 */

export interface BannerItem {
  banner_image: string;
  title: string;
  content: string;
  redirect_category_id: string;
  redirect_url: string;
}

export interface CategoryTileItem {
  category_name: string;
  category_image: string;
  category_id: string;
}

export interface ProductItem {
  product_id: string;
  product_title: string;
  product_image: string;
  category_id: string;
  mrp: number;
  discount_price: number;
  discount_percentage: number;
  is_add_to_cart: boolean;
}

export interface CleanDashboardWidget {
  widget_id: string;
  widget_name: string;
  sequence: number;
  widget_redirect_to: string;
  redirect_category_id: string;
  redirect_product_id: string;
  items: any[];
}

export interface CustomerDashboardResponse {
  success: boolean;
  module: string;
  categoryId: string;
  territory: string;
  warehouseId?: string;
  count: number;
  widgets: CleanDashboardWidget[];
}

export interface DashboardQueryDto {
  module: string;
  categoryId: string;
  territory: string;
  warehouseId?: string;
  raw?: boolean;
}

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
  effective_from: string;
  effective_to: string;
  status: boolean;
  module: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
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
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardWidget;
}

export interface DashboardListResponse {
  success: boolean;
  count: number;
  data: DashboardWidget[];
}
