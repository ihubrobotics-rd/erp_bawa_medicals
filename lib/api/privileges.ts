// lib/api/privileges.ts

import api from "../api";
import type {
  ModulePrivilege,
  SubmodulePrivilege,
  FunctionalityPrivilege,
  ConsolidatedRolePrivileges,
  
} from "@/types/privileges";

// Get all privileges for a specific role with pagination
export const getPrivilegesForRole = async (
  roleId: number,
  page: number = 1
): Promise<ConsolidatedRolePrivileges> => {
  const { data } = await api.get(`/Privilege/role/privileges/${roleId}/`, {
    params: { page },
  });
  // The API response nests the actual data under a 'data' key
  return data.data;
};


// POST/UPDATE module privilege
export const setModulePrivilege = async (
  payload: Omit<ModulePrivilege, "id" | "role_name" | "module_name">
): Promise<ModulePrivilege> => {
  const { data } = await api.post(
    "/Privilege/privileges/module/create/",
    payload
  );
  return data.data as ModulePrivilege;
};

// POST/UPDATE submodule privilege
export const setSubmodulePrivilege = async (
  payload: Omit<SubmodulePrivilege, "id" | "role_name" | "submodule_name" | "module_name">
): Promise<SubmodulePrivilege> => {
  const { data } = await api.post(
    "/Privilege/submodule/privileges/create/",
    payload
  );
  // Assuming the POST response also nests the result in a 'data' object.
  // If your API returns the object directly at the root, change this to `return data;`
  return data.data as SubmodulePrivilege;
};

// POST/UPDATE functionality privilege


export const setFunctionalityPrivilege = async (
  payload: Omit<
    FunctionalityPrivilege,
    "id" | "role_name" | "functionality_name" | "submodule_name" | "module_name"
  >
): Promise<FunctionalityPrivilege> => {
  const { data } = await api.post(
    "/Privilege/functionality/privileges/create/",
    payload
  );
  return data.data as FunctionalityPrivilege;
};

// Fetch combined schema for a specific submodule
export const getSubmoduleSchema = async (submoduleId: string) => {
  if (!submoduleId) return null;
  const { data } = await api.get(`/Privilege/submodules/combined/?submodule_id=${submoduleId}`);
  return data.data;
};

export const getFunctionalitySchema = async (functionalityId: string) => {
  if (!functionalityId) return null;
  const { data } = await api.get(`/Privilege/functionality/combined/?functionality_id=${functionalityId}`);
  return data.data;
}