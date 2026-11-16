/**
 * Dashboard Types and DTO Interfaces
 * Supports the 18-column widget configuration architecture with JSONB items.
 */

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
