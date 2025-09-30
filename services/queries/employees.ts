import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Employee } from "@/types/entities"
import type { EmployeeFormData } from "@/utils/validation"

// Query Keys
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: string) => [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
}

// API Functions
const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get("/employees")
    return response.data
  },

  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },

  createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
    const response = await api.post("/employees", data)
    return response.data
  },

  updateEmployee: async ({ id, data }: { id: string; data: Partial<EmployeeFormData> }): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data)
    return response.data
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`)
  },
}

// Hooks
export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: employeeApi.getEmployees,
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getEmployee(id),
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeeApi.updateEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.setQueryData(employeeKeys.detail(data.id), data)
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}
