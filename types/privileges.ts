// types/privileges.ts
export type PrivilegeBase = {
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
};
export interface ModulePrivilege {
  id: number;
  role: number;
  role_name: string;
  module: number; // This is the module ID
  module_name: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface SubmodulePrivilege {
  id: number;
  role: number;
  role_name?: string;
  submodule: number; // This is the submodule ID
  submodule_name?: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface FunctionalityPrivilege extends PrivilegeBase {
  id: number;
  role: number;
  role_name: string;
  functionality: number;
  functionality_name: string;
  submodule_name: string;
  module_name: string;
  created_at: string;
}

// Helper type to match the paginated structure from your API
interface PaginatedResult<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// CORRECTED TYPE: This now perfectly matches your API response structure.
export interface ConsolidatedRolePrivileges {
  modules: PaginatedResult<ModulePrivilege>;
  submodules: PaginatedResult<SubmodulePrivilege>;
  functionalities: PaginatedResult<FunctionalityPrivilege>;
}