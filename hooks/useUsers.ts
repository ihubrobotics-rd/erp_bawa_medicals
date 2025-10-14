import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

  const usersQuery = useQuery<User[]>({
    queryKey: ["users", searchQuery],
    queryFn: () => getUsers(searchQuery),
    refetchOnWindowFocus: true,
  });

  // ✅ Mutation for creating a user with proper error handling
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserPayload) => createUser(userData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
    },

    onError: (error: any) => {
      // Safely extract message and errors
      const response = error?.response?.data;
      const backendMessage = response?.message || "User creation failed.";
      const backendErrors = response?.errors || {};

      // Flatten all error messages
      const errorMessages: string[] = [];

      for (const key in backendErrors) {
        if (Array.isArray(backendErrors[key])) {
          backendErrors[key].forEach((msg: string) =>
            errorMessages.push(`${key !== "non_field_errors" ? `${key}: ` : ""}${msg}`)
          );
        }
      }

      // Show all error messages in Sonner toast
      if (errorMessages.length > 0) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(backendMessage);
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update user.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete user.");
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
