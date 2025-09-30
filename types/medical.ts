// types/medical.ts

export type Role = {
  id: number;
  name: string;
  description?: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  mobile: string;
  role: number;
  role_name?: string;
  is_active: boolean;
  created_at: string;
};