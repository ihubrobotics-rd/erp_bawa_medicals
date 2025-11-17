"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/lib/api/privileges";
import type {
  ModulePrivilege,
  SubmodulePrivilege,
  FunctionalityPrivilege,
} from "@/types/privileges";

// --- Payload types ---
type ModulePrivilegePayload = Omit<
  ModulePrivilege,
  "id" | "role_name" | "module_name"
>;
type SubmodulePrivilegePayload = Omit<
  SubmodulePrivilege,
  "id" | "role_name" | "submodule_name" | "module_name"
>;

type FunctionalityPrivilegePayload = Omit<
  FunctionalityPrivilege,
  "id" | "role_name" | "functionality_name" | "submodule_name" | "module_name" | "created_at"
>;

export const usePrivileges = (roleId: number | null) => {
  const queryClient = useQueryClient();
  // Key for THIS page's data
  const queryKey = ["rolePrivileges", roleId];
  // Key for the NAVBAR's data
  const navbarQueryKey = ["privileges", roleId];

  // Fetch all privileges (paginated)
  const allPrivilegesQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => api.getPrivilegesForRole(roleId!, pageParam),
    enabled: typeof roleId === "number",
    getNextPageParam: (lastPage) => {
      const nextSubmoduleUrl = lastPage?.submodules?.next;
      const nextModuleUrl = lastPage?.modules?.next;
      const nextUrl = nextSubmoduleUrl || nextModuleUrl;

      if (nextUrl) {
        try {
          const url = new URL(nextUrl);
          const nextPage = url.searchParams.get("page");
          return nextPage ? parseInt(nextPage, 10) : undefined;
        } catch (error) {
          console.error("Failed to parse next page URL:", error);
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Submodule privilege mutation (Optimistic updates removed for live refresh)
  const setSubmodulePrivilegeMutation = useMutation({
    mutationFn: (payload: SubmodulePrivilegePayload) =>
      api.setSubmodulePrivilege(payload),
    onSuccess: () => {
      // Invalidate BOTH queries
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: navbarQueryKey });
    },
  });

  // Module privilege mutation
  const setModulePrivilegeMutation = useMutation({
    mutationFn: (payload: ModulePrivilegePayload) =>
      api.setModulePrivilege(payload),
    onSuccess: () => {
      // Invalidate BOTH queries
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: navbarQueryKey });
    },
  });

  // Functionality privilege mutation (Optimistic updates removed for live refresh)
  const setFunctionalityPrivilegeMutation = useMutation({
    mutationFn: (payload: FunctionalityPrivilegePayload) =>
      api.setFunctionalityPrivilege(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: navbarQueryKey });
    },
  });

  return {
    allPrivilegesQuery,
    setModulePrivilegeMutation,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  };
};