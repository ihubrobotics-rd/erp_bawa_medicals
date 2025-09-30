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
  created_at: string;
};