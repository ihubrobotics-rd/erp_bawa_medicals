// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/lib/api/users";
import type { User } from "@/types/medical";

export const useUsers = (searchQuery: string = "") => {
  const queryClient = useQueryClient();

  // Query to fetch the list of users
  const usersQuery = useQuery<User[]>({
    queryKey: ["users", searchQuery], // Include search query in key to refetch on change
    queryFn: () => getUsers(searchQuery),
    refetchOnWindowFocus: true,
  });

  // Mutation for creating a user
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserPayload) => createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch the users list to show the new user
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Mutation for updating a user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};


export const useUser = (userId: number | null) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!), 
    enabled: !!userId,
  });
};