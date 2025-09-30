"use client"

import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/types/roles"
import { formatRole } from "@/utils/formatters"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

const roleColors = {
  [UserRole.SUPER_ADMIN]: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  [UserRole.ADMIN]: "bg-red-100 text-red-800 hover:bg-red-200",
  [UserRole.SALES]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  [UserRole.EMPLOYEE]: "bg-green-100 text-green-800 hover:bg-green-200",
  [UserRole.CUSTOMER]: "bg-gray-100 text-gray-800 hover:bg-gray-200",
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge variant="secondary" className={`${roleColors[role]} ${className}`}>
      {formatRole(role)}
    </Badge>
  )
}
