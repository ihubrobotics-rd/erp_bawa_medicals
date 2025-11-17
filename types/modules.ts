// types/modules.ts

export type Module = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export type Submodule = {
  id: number;
  name: string;
  description: string;
  module: number; // Foreign key ID
  module_name?: string; // Often included in list views
  is_active: boolean;
  created_at: string;
};

export type Functionality = {
  id: number;
  name: string;
  description: string;
  submodule: number; // Foreign key ID
  submodule_name?: string;
  is_active: boolean;
  created_at: string;
};


export interface PaginationInfo {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
}

export interface PaginatedResponse<T> {
  pagination: PaginationInfo;
  results: T[];
}