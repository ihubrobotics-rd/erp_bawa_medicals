import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Product } from "@/types/entities"
import type { ProductFormData } from "@/utils/validation"

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

// API Functions
const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products")
    return response.data
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (data: ProductFormData): Promise<Product> => {
    const response = await api.post("/products", data)
    return response.data
  },

  updateProduct: async ({ id, data }: { id: string; data: Partial<ProductFormData> }): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
}

// Hooks
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: productApi.getProducts,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.setQueryData(productKeys.detail(data.id), data)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
