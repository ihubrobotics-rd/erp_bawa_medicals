"use client"

import type React from "react"

import { usePermissions } from "@/hooks/usePermissions"
import type { UserRole } from "@/types/roles"

interface PermissionGuardProps {
  children: React.ReactNode
  roles?: UserRole[]
  permissions?: string[]
  fallback?: React.ReactNode
  requireAll?: boolean // If true, user must have ALL specified roles/permissions
}

export function PermissionGuard({
  children,
  roles = [],
  permissions = [],
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { user, hasRole, hasPermission } = usePermissions()

  if (!user) {
    return <>{fallback}</>
  }

  // Check roles
  if (roles.length > 0) {
    const roleCheck = requireAll ? roles.every((role) => hasRole(role)) : roles.some((role) => hasRole(role))

    if (!roleCheck) {
      return <>{fallback}</>
    }
  }

  // Check permissions
  if (permissions.length > 0) {
    const permissionCheck = requireAll
      ? permissions.every((permission) => hasPermission(permission))
      : permissions.some((permission) => hasPermission(permission))

    if (!permissionCheck) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
