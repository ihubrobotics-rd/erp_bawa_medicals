"use client"

import { useState } from "react"
import { Shield, Users, Edit, Plus, Trash2 } from "lucide-react" // Added Trash2
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, // Added AlertDialog
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRoles } from "@/hooks/useRoles"
import { Role } from "@/lib/api/roles"

const allPermissions = [
  { id: "user_management", name: "User Management", description: "Create, edit, and delete users" },
  { id: "role_management", name: "Role Management", description: "Manage roles and permissions" },
  { id: "medicine_management", name: "Medicine Management", description: "Add, edit, and manage medicines" },
  { id: "stock_management", name: "Stock Management", description: "Manage inventory and stock levels" },
  { id: "order_management", name: "Order Management", description: "Process and manage orders" },
  { id: "customer_management", name: "Customer Management", description: "Manage customer information" },
  { id: "supplier_management", name: "Supplier Management", description: "Manage supplier relationships" },
  { id: "reports_access", name: "Reports Access", description: "View and generate reports" },
  { id: "system_settings", name: "System Settings", description: "Configure system settings" },
  { id: "medicine_view", name: "Medicine View", description: "View medicine catalog" },
  { id: "order_create", name: "Order Create", description: "Create new orders" },
  { id: "stock_alerts", name: "Stock Alerts", description: "Manage stock alert notifications" },
  { id: "profile_management", name: "Profile Management", description: "Manage own profile" },
]

export function RoleManagement() {
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<number | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])

  // Create Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const [newRoleIsActive, setNewRoleIsActive] = useState(true)

  // Edit Dialog State
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

   // Deactivate Alert State
  const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false)
  const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null)

  const { rolesQuery, createRoleMutation, updateRoleMutation ,deactivateRoleMutation} = useRoles()
  const roles: Role[] = rolesQuery.data || []

  const handleSelectRoleForPermissions = (roleId: number) => {
    setSelectedRoleForPermissions(roleId)
    setEditingPermissions([]) // will use mock until API supports permissions
  }

  const handlePermissionToggle = (permissionId: string) => {
    setEditingPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    )
  }

  const handleSavePermissions = () => {
    console.log("Saving permissions for role:", selectedRoleForPermissions, editingPermissions)
    setSelectedRoleForPermissions(null)
    setEditingPermissions([])
  }

  // --- Create Role Logic ---
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return
    try {
      await createRoleMutation.mutateAsync({
        name: newRoleName,
        description: newRoleDesc,
        is_active: newRoleIsActive,
      })
      setNewRoleName("")
      setNewRoleDesc("")
      setNewRoleIsActive(true)
      setIsCreateOpen(false)
    } catch (err) {
      console.error("Failed to create role:", err)
    }
  }

  // --- Edit Role Logic ---
  const handleOpenEditDialog = (role: Role) => {
    setEditingRole(role)
    setIsEditOpen(true)
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return
    try {
      await updateRoleMutation.mutateAsync({
        id: editingRole.id,
        data: {
          name: editingRole.name,
          description: editingRole.description,
          is_active: editingRole.is_active,
        },
      })
      setIsEditOpen(false)
      setEditingRole(null)
    } catch (err) {
      console.error("Failed to update role:", err)
    }
  }

  const handleOpenDeactivateAlert = (role: Role) => {
    setRoleToDeactivate(role)
    setIsDeactivateAlertOpen(true)
  }

  const handleDeactivateRole = async () => {
    if (!roleToDeactivate) return
    try {
      await deactivateRoleMutation.mutateAsync(roleToDeactivate.id)
      setIsDeactivateAlertOpen(false)
      setRoleToDeactivate(null)
    } catch (err) {
      console.error("Failed to deactivate role:", err)
    }
  } 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Roles & Permissions</h3>
        <Button onClick={() => setIsCreateOpen(true)} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <Input
              placeholder="Role Description"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active_create"
                checked={newRoleIsActive}
                onCheckedChange={(checked) => setNewRoleIsActive(Boolean(checked))}
              />
              <Label htmlFor="is_active_create" className="cursor-pointer">
                Is Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      {editingRole && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role: {editingRole.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Role Name"
                value={editingRole.name}
                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
              />
              <Input
                placeholder="Role Description"
                value={editingRole.description}
                onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active_edit"
                  checked={editingRole.is_active}
                  onCheckedChange={(checked) =>
                    setEditingRole({ ...editingRole, is_active: Boolean(checked) })
                  }
                />
                <Label htmlFor="is_active_edit" className="cursor-pointer">
                  Is Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
                {updateRoleMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


       {/* Deactivate Role Confirmation Dialog */}
      <AlertDialog open={isDeactivateAlertOpen} onOpenChange={setIsDeactivateAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deactivate the role "{roleToDeactivate?.name}". Users with this role
              may lose their permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateRole}
              className="bg-destructive  hover:bg-destructive/90"
              disabled={deactivateRoleMutation.isPending}
            >
              {deactivateRoleMutation.isPending ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <div className="grid lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="space-y-4">
          <h4 className="font-medium">System Roles</h4>
          {roles.length === 0 ? (
            <p className="text-muted-foreground text-sm">No roles found</p>
          ) : (
            roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-colors ${
                  selectedRoleForPermissions === role.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelectRoleForPermissions(role.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <h5 className="font-medium">{role.name}</h5>
                      {!role.is_active && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />0
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenEditDialog(role)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                          <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDeactivateAlert(role)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{role.description || "-"}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      +0 permissions
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Permission Editor */}
        <div>
          {selectedRoleForPermissions ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Edit Permissions: {roles.find((r) => r.id === selectedRoleForPermissions)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={editingPermissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                        {permission.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRoleForPermissions(null)}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSavePermissions} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Role</h3>
                <p className="text-muted-foreground">
                  Choose a role from the left to edit its permissions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}