// lib/api/privileges.ts

import api from "../api";
import type {
  ModulePrivilege,
  SubmodulePrivilege,
  FunctionalityPrivilege,
  ConsolidatedRolePrivileges, 
} from "@/types/privileges";

// NEW: Get all privileges for a specific role
export const getPrivilegesForRole = async (
  roleId: number
): Promise<ConsolidatedRolePrivileges> => {
  const { data } = await api.get(`/Privilege/role/privileges/${roleId}/`);
  // Assuming the response is { data: { module_privileges: [...], submodule_privileges: [...] ... } }
  // Adjust the return statement to match your actual API response structure
  return data.data;
};

// POST/UPDATE module privilege (This function is mostly the same)
export const setModulePrivilege = async (
  payload: Omit<ModulePrivilege, "id" | "role_name" | "module_name">
): Promise<ModulePrivilege> => {
  const { data } = await api.post(
    "/Privilege/privileges/module/create/",
    payload
  );
  return data.data as ModulePrivilege;
};

// POST/UPDATE submodule privilege (This function is mostly the same)
export const setSubmodulePrivilege = async (
  payload: Omit<SubmodulePrivilege, "id" | "role_name" | "submodule_name">
): Promise<SubmodulePrivilege> => {
  const { data } = await api.post(
    "/Privilege/submodule/privileges/create/",
    payload
  );
  return data.data as SubmodulePrivilege;
};

// POST/UPDATE functionality privilege (This function is mostly the same)
export const setFunctionalityPrivilege = async (
  payload: Omit<
    FunctionalityPrivilege,
    "id" | "role_name" | "functionality_name"
  >
): Promise<FunctionalityPrivilege> => {
  const { data } = await api.post(
    "/Privilege/functionality/privileges/create/",
    payload
  );
  return data.data as FunctionalityPrivilege;
};