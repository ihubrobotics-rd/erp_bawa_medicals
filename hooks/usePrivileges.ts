// hooks/usePrivileges.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/privileges";
import type {
  ModulePrivilege,
  SubmodulePrivilege,
  FunctionalityPrivilege,
  ConsolidatedRolePrivileges,
} from "@/types/privileges";

// Payload types remain the same
type ModulePrivilegePayload = Omit<
  ModulePrivilege,
  "id" | "role_name" | "module_name"
>;
type SubmodulePrivilegePayload = Omit<
  SubmodulePrivilege,
  "id" | "role_name" | "submodule_name"
>;
type FunctionalityPrivilegePayload = Omit<
  FunctionalityPrivilege,
  "id" | "role_name" | "functionality_name"
>;

export const usePrivileges = (roleId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["rolePrivileges", roleId];

  const allPrivilegesQuery = useQuery<ConsolidatedRolePrivileges>({
    queryKey,
    queryFn: () => api.getPrivilegesForRole(roleId!),
    enabled: typeof roleId === "number",
    // ADD THESE OPTIONS to make refetching more aggressive
    staleTime: 0,
    cacheTime: 0,
  });


  // The onSuccess callback for all mutations will invalidate the single query
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const setModulePrivilegeMutation = useMutation({
    mutationFn: (payload: ModulePrivilegePayload) =>
      api.setModulePrivilege(payload),
    onSuccess,
  });

  const setSubmodulePrivilegeMutation = useMutation({
    mutationFn: (payload: SubmodulePrivilegePayload) =>
      api.setSubmodulePrivilege(payload),
    onSuccess,
  });

  const setFunctionalityPrivilegeMutation = useMutation({
    mutationFn: (payload: FunctionalityPrivilegePayload) =>
      api.setFunctionalityPrivilege(payload),
    onSuccess,
  });

 return {
    allPrivilegesQuery,
    setModulePrivilegeMutation,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  };
};