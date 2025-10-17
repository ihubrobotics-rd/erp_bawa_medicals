// hooks/useModules.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/modules";

// == HOOK FOR MODULES ==

export const useModules = (search: string = "") => {
  const queryClient = useQueryClient();

  const modulesQuery = useQuery({
    queryKey: ["modules", search],
    queryFn: () => api.getModules(search),
  });

  const createModuleMutation = useMutation({
    mutationFn: api.createModule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modules"] }),
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { name: string; description: string };
    }) => api.updateModule(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modules"] }),
  });

  const deactivateModuleMutation = useMutation({
    mutationFn: api.deactivateModule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modules"] }),
  });

  return {
    modulesQuery,
    createModuleMutation,
    updateModuleMutation,
    deactivateModuleMutation,
  };
};

// == HOOK FOR SUBMODULES & FUNCTIONALITIES ==
export const useSubmodules = (moduleId: number | null, search: string = "") => {
  const queryClient = useQueryClient();

  const submodulesQuery = useQuery({
    queryKey: ["submodules", moduleId, search],
    queryFn: () => api.getSubmodules({ module: moduleId!, search }),
    enabled: !!moduleId,
  });

  const createSubmoduleMutation = useMutation({
    mutationFn: api.createSubmodule,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });

  const updateSubmoduleMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { name: string; description: string; module: number };
    }) => api.updateSubmodule(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });

  const deactivateSubmoduleMutation = useMutation({
    mutationFn: api.deactivateSubmodule,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });
  const createFunctionalityMutation = useMutation({
    mutationFn: api.createFunctionality,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["functionalities", data.submodule],
      });
    },
  });

  return {
    submodulesQuery,
    createSubmoduleMutation,
    updateSubmoduleMutation,
    deactivateSubmoduleMutation,
    createFunctionalityMutation,
  };
};

// == NEW HOOK FOR FUNCTIONALITIES ==
// ✨ --- CHANGED: Updated hook to handle search functionality ---
export const useFunctionalities = (
  submoduleId: number | null,
  search: string = ""
) => {
  const queryClient = useQueryClient();

  const functionalitiesQuery = useQuery({
    // Add search to the queryKey to refetch when it changes
    queryKey: ["functionalities", submoduleId, search],
    // Pass the submodule ID and search term to the API call
    queryFn: () => api.getFunctionalities({ submodule: submoduleId!, search }),
    enabled: !!submoduleId,
  });

  const updateFunctionalityMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof api.updateFunctionality>[1];
    }) => api.updateFunctionality(id, payload),
    // Invalidate based on submoduleId to refresh the list after an update
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["functionalities", submoduleId],
      }),
  });

  const deactivateFunctionalityMutation = useMutation({
    mutationFn: api.deactivateFunctionality,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["functionalities", submoduleId],
      }),
  });

  return {
    functionalitiesQuery,
    updateFunctionalityMutation,
    deactivateFunctionalityMutation,
  };
};

// == HOOK TO FETCH ALL ENTITIES WITHOUT FILTERS ==
export const useEntities = () => {
  const modulesQuery = useQuery({
    queryKey: ["allModules"],
    queryFn: api.getAllModules,
  });

  const submodulesQuery = useQuery({
    queryKey: ["allSubmodules"],
    queryFn: api.getAllSubmodules,
  });

  const functionalitiesQuery = useQuery({
    queryKey: ["allFunctionalities"],
    queryFn: api.getAllFunctionalities,
  });

  return {
    modulesQuery,
    submodulesQuery,
    functionalitiesQuery,
  };
};
