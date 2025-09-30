// lib/api/modules.ts
import api from "../api";
import type { Module, Submodule, Functionality } from "@/types/modules";

type ModulePayload = { name: string; description: string };
type SubmodulePayload = { name: string; description: string; module: number };
type FunctionalityPayload = { name: string; description: string; submodule: number };

export const getModules = async (search?: string): Promise<Module[]> => {
  const { data } = await api.get("/module/modules/list/", { params: { search } });
  return data.data.results || data.data || data;
};
export const createModule = async (payload: ModulePayload): Promise<Module> => {
  const { data } = await api.post("/module/modules/create/", payload);
  return data.data;
};
export const updateModule = async (id: number, payload: ModulePayload): Promise<Module> => {
  const { data } = await api.patch(`/module/modules/update/${id}/`, payload);
  return data.data;
};
export const deactivateModule = async (id: number) => {
  return await api.delete(`/module/modules/deactivate/${id}/`);
};

// == SUBMODULES API ==
type GetSubmodulesParams = { search?: string; module?: number };
export const getSubmodules = async (params: GetSubmodulesParams): Promise<Submodule[]> => {
  const { data } = await api.get("/module/submodules/list/", { params });
  return data.data.results || data.data || data;
};
export const createSubmodule = async (payload: SubmodulePayload): Promise<Submodule> => {
  const { data } = await api.post("/module/submodules/create/", payload);
  return data.data;
};
export const updateSubmodule = async (id: number, payload: SubmodulePayload): Promise<Submodule> => {
  const { data } = await api.patch(`/module/submodules/edit/${id}/`, payload); // Note: your doc said 'edit'
  return data.data;
};
export const deactivateSubmodule = async (id: number) => {
  return await api.delete(`/module/submodules/deactivate/${id}/`);
};

// == FUNCTIONALITIES API ==
export const createFunctionality = async (payload: FunctionalityPayload): Promise<Functionality> => {
  const { data } = await api.post("/module/functionalities/create/", payload);
  return data.data;
};
