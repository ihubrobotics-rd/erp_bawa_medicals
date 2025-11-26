"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PermissionGuard } from "@/components/ui/permission-guard"
import { RoleBadge } from "@/components/ui/role-badge"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types/roles"
import { Settings, User, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PermissionGuard
        roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to view this page.</p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage system settings and configurations</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details and role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="mt-1">{user?.role && <RoleBadge role={user.role} />}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Permissions
                </CardTitle>
                <CardDescription>Your current system permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user?.permissions?.map((permission: string) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <PermissionGuard roles={[UserRole.SUPER_ADMIN]}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Advanced system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    System configuration options will be available in future updates.
                  </p>
                </CardContent>
              </Card>
            </PermissionGuard>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Application Settings
                </CardTitle>
                <CardDescription>General application preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Application settings and preferences will be available in future updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  )
}
