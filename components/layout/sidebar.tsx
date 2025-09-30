"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types/roles"
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  UserCheck,
  Settings,
  LogOut,
  BarChart3,
  ShoppingCart,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES, UserRole.EMPLOYEE, UserRole.CUSTOMER],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Building2,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES],
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: UserCheck,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES, UserRole.CUSTOMER],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
]

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 mr-2 text-primary" />
            <h2 className="text-lg font-semibold">ERP System</h2>
          </div>
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role.replace("-", " ")}</p>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
