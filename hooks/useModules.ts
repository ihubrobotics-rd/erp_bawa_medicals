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
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; description: string } }) =>
      api.updateModule(id, payload),
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
    enabled: !!moduleId, // Only run query if a module is selected
  });

  const createSubmoduleMutation = useMutation({
    mutationFn: api.createSubmodule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });

  const updateSubmoduleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; description: string; module: number } }) =>
      api.updateSubmodule(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });

  const deactivateSubmoduleMutation = useMutation({
    mutationFn: api.deactivateSubmodule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] }),
  });
  
  const createFunctionalityMutation = useMutation({
    mutationFn: api.createFunctionality,
     onSuccess: () => {
    
    },
  });

  return {
    submodulesQuery,
    createSubmoduleMutation,
    updateSubmoduleMutation,
    deactivateSubmoduleMutation,
    createFunctionalityMutation
  };
};