"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { User } from "@/types/roles"
import type { UserFormData } from "@/utils/validation"

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// API Functions
const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get("/users")
    return response.data
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (data: UserFormData): Promise<User> => {
    const response = await api.post("/users", data)
    return response.data
  },

  updateUser: async ({ id, data }: { id: string; data: Partial<UserFormData> }): Promise<User> => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}

// Hooks
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userApi.getUsers,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.setQueryData(userKeys.detail(data.id), data)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
