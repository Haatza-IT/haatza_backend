/**
 * Dashboard Types and DTO Interfaces
 * Field casing adheres strictly to the database table contract:
 * Widget_id, Widget_name, Redirected_to, Placement, Sequence, Territory, Items, Product_Id, Category_Id
 */

export interface DashboardWidget {
  Widget_id: string;
  Widget_name: string;
  Redirected_to: string | null;
  Placement: string | null;
  Sequence: number | null;
  Territory: string | null;
  Items: string[];
  Product_Id: string | null;
  Category_Id: string | null;
}

export interface CreateDashboardDto {
  Widget_id: string;
  Widget_name: string;
  Redirected_to?: string | null;
  Placement?: string | null;
  Sequence?: number | null;
  Territory?: string | null;
  Items?: string[];
  Product_Id?: string | null;
  Category_Id?: string | null;
}

export interface UpdateDashboardDto {
  Widget_id?: string;
  Widget_name?: string;
  Redirected_to?: string | null;
  Placement?: string | null;
  Sequence?: number | null;
  Territory?: string | null;
  Items?: string[];
  Product_Id?: string | null;
  Category_Id?: string | null;
}

export interface DashboardQueryDto {
  page?: number;
  limit?: number;
  placement?: string;
  territory?: string;
  sequence?: number | string;
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
