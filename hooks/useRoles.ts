// hooks/useRoles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deactivateRole, Role } from "@/lib/api/roles";

type UpdateRoleVars = {
  id: number;
  data: {
    name: string;
    description: string;
    is_active: boolean;
  };
};

export const useRoles = () => {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: UpdateRoleVars) => updateRole(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const deactivateRoleMutation = useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  return {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deactivateRoleMutation,
  };
};