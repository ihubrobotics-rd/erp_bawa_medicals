import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Customer } from "@/types/entities"
import type { CustomerFormData } from "@/utils/validation"

// Query Keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
}

// API Functions
const customerApi = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get("/customers")
    return response.data
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  createCustomer: async (data: CustomerFormData): Promise<Customer> => {
    const response = await api.post("/customers", data)
    return response.data
  },

  updateCustomer: async ({ id, data }: { id: string; data: Partial<CustomerFormData> }): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data)
    return response.data
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`)
  },
}

// Hooks
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: customerApi.getCustomers,
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getCustomer(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerApi.updateCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.setQueryData(customerKeys.detail(data.id), data)
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}
