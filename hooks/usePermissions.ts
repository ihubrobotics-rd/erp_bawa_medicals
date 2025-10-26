"use client"

import { useAuth } from "./useAuth"
import { UserRole } from "@/types/roles"

export function usePermissions() {
  // 🧩 When rendering on the server or before hydration
  if (typeof window === "undefined") {
    return {
      user: null,
      hasPermission: () => false,
      hasRole: () => false,
      canManageUsers: () => false,
      canManageProducts: () => false,
      canViewReports: () => false,
      canManageEmployees: () => false,
      canManageCustomers: () => false,
      canCreateInvoices: () => false,
    }
  }

  // 🧠 Safe on client
  const { user, hasPermission, hasRole } = useAuth()

  const canManageUsers = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageProducts = () =>
    hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])
  const canViewReports = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageEmployees = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageCustomers = () =>
    hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])
  const canCreateInvoices = () =>
    hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])

  return {
    user,
    hasPermission,
    hasRole,
    canManageUsers,
    canManageProducts,
    canViewReports,
    canManageEmployees,
    canManageCustomers,
    canCreateInvoices,
  }
}
