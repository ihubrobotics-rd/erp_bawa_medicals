export enum UserRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  SALES = "sales",
  EMPLOYEE = "employee",
  CUSTOMER = "customer",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
