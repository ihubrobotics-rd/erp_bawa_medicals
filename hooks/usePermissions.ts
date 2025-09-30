"use client"

import { useAuth } from "./useAuth"
import { UserRole } from "@/types/roles"

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth()

  const canManageUsers = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageProducts = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])
  const canViewReports = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageEmployees = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  const canManageCustomers = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])
  const canCreateInvoices = () => hasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES])

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
