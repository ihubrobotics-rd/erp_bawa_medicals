// lib/api/users.ts
import api from "../api"; // Assuming you have a configured axios instance
import type { User } from "@/types/medical";

// Define payloads for creating and updating users
export type CreateUserPayload = {
  username: string;
  email: string;
  mobile: string;
  role: number; // Role ID
  password?: string;
  confirm_password?: string;
};

export type UpdateUserPayload = {
  email: string;
  mobile: string;
  role?: number; // Role is optional for standard users, required for superadmin edits
  is_active?: boolean;
};

// GET: List all users
export const getUsers = async (search?: string): Promise<User[]> => {
  const { data } = await api.get("/accounts/users/list/", { params: { search } });
  return data.data.results || data.data || data;
};

// POST: Create a new user
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  const { data } = await api.post("/accounts/users/register/", userData);
  return data.data;
};

// PATCH: Update an existing user
export const updateUser = async (id: number, userData: UpdateUserPayload): Promise<User> => {
  const { data } = await api.patch(`/accounts/users/update/${id}/`, userData);
  return data.data;
};

// DELETE: Deactivate/delete a user (assuming endpoint)
export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/accounts/users/deactivate/${id}/`);
  return data;
};

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/accounts/users/detail/${id}/`);
   return data.data;
};