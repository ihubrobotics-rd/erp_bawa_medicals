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
  "id" | "role_name" | "functionality_name" | "submodule_name" | "module_name"
>;

export const usePrivileges = (roleId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["rolePrivileges", roleId];

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

  // Submodule privilege mutation with optimistic updates
  const setSubmodulePrivilegeMutation = useMutation({
    mutationFn: (payload: SubmodulePrivilegePayload) =>
      api.setSubmodulePrivilege(payload),
    onMutate: async (newPrivilege) => {
      await queryClient.cancelQueries({ queryKey });
      const previousPrivileges = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          submodules: {
            ...page.submodules,
            results: page.submodules.results.map((sub: SubmodulePrivilege) =>
              sub.submodule === newPrivilege.submodule
                ? { ...sub, ...newPrivilege }
                : sub
            ),
          },
        }));
        return { ...oldData, pages: newPages };
      });

      return { previousPrivileges };
    },
    onError: (err, newPrivilege, context) => {
      if (context?.previousPrivileges) {
        queryClient.setQueryData(queryKey, context.previousPrivileges);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Module privilege mutation
  const setModulePrivilegeMutation = useMutation({
    mutationFn: (payload: ModulePrivilegePayload) =>
      api.setModulePrivilege(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Functionality privilege mutation
    const setFunctionalityPrivilegeMutation = useMutation({
    mutationFn: (payload: FunctionalityPrivilegePayload) =>
      api.setFunctionalityPrivilege(payload),
    onMutate: async (newPrivilege) => {
        await queryClient.cancelQueries({ queryKey });
        const previousPrivileges = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((page: any) => ({
                ...page,
                functionalities: {
                    ...page.functionalities,
                    results: page.functionalities.results.map((func: FunctionalityPrivilege) =>
                        func.functionality === newPrivilege.functionality
                            ? { ...func, ...newPrivilege }
                            : func
                    ),
                },
            }));
            return { ...oldData, pages: newPages };
        });

        return { previousPrivileges };
    },
    onError: (err, newPrivilege, context) => {
        if (context?.previousPrivileges) {
            queryClient.setQueryData(queryKey, context.previousPrivileges);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    allPrivilegesQuery,
    setModulePrivilegeMutation,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  };
};