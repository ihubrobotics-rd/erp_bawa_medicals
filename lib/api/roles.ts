// lib/api/roles.ts
import api from "../api";

export type Role = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export type CreateRolePayload = {
  name: string;
  description: string;
  is_active: boolean;
};

type UpdateRolePayload = {
  name: string;
  description: string;
  is_active: boolean;
};

// List roles
export const getRoles = async (search?: string): Promise<Role[]> => {
  const { data } = await api.get("/accounts/roles/list/", { params: { search } });
  return data.data.results;
};

// Create role
export const createRole = async (role: CreateRolePayload): Promise<Role> => {
  const { data } = await api.post("/accounts/roles/create/", role);
  return data.data;
};

// Update role
export const updateRole = async (id: number, role: UpdateRolePayload): Promise<Role> => {
  const { data } = await api.put(`/accounts/roles/update/${id}/`, role);
  return data.data;
};

// Deactivate role
export const deactivateRole = async (id: number) => {
  const { data } = await api.delete(`/accounts/roles/deactivate/${id}/`);
  return data;
};