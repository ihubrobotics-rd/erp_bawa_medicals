"use client";

import { useState, useMemo } from "react";
import { Shield, Edit, Plus, Trash2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

// --- HOOKS ---
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useModules"; // NEW: Replaces useModules
import { usePrivileges } from "@/hooks/usePrivileges"; // Refactored hook

// --- TYPES ---
import type { Role } from "@/lib/api/roles";
import type { Module, Submodule, Functionality } from "@/types/modules";

// Base type for permissions
type PrivilegeBase = {
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

// Helper component for rendering permission switches (Unchanged)
const PermissionSwitches = ({
  privileges,
  onUpdate,
  isLoading,
  entityId,
}: {
  privileges: PrivilegeBase;
  onUpdate: (key: keyof PrivilegeBase, value: boolean) => void;
  isLoading: boolean;
  entityId: string;
}) => {
  return (
    <div className="flex items-center gap-x-3 sm:gap-x-6 ">
      {(["can_view", "can_add", "can_edit", "can_delete"] as const).map(
        (key) => (
          <div key={key} className="flex items-center space-x-2 ">
            <Switch
              id={`${key}-${entityId}`}
              checked={privileges[key]}
              onCheckedChange={(value) => onUpdate(key, value)}
              disabled={isLoading}
              className="cursor-pointer"
            />
            <label
              htmlFor={`${key}-${entityId}`}
              className="text-sm font-medium capitalize hidden sm:inline"
            >
              {key.split("_")[1]}
            </label>
          </div>
        )
      )}
    </div>
  );
};

export function RoleManagement() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "modules" | "submodules" | "functionalities"
  >("modules");

  // --- STATE FOR ROLE CRUD (Unchanged) ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleIsActive, setNewRoleIsActive] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
  const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null);

  // --- HOOKS FOR DATA FETCHING ---
  const {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deactivateRoleMutation,
  } = useRoles();
  // NEW: Fetch all entities (modules, submodules, etc.)
  const { modulesQuery, submodulesQuery, functionalitiesQuery } =
    useEntities();
  // NEW: Use the refactored privileges hook
  const {
    allPrivilegesQuery,
    setModulePrivilegeMutation,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  } = usePrivileges(selectedRoleId);

  const roles: Role[] = rolesQuery.data || [];

  const defaultPrivs: PrivilegeBase = {
    can_view: false,
    can_add: false,
    can_edit: false,
    can_delete: false,
  };



  // REFACTORED: Create privilege maps from the single consolidated query with CORRECT keys
  const modulePrivilegesMap = useMemo(() => {
    const map = new Map<number, PrivilegeBase>();
    // CORRECTED: Access data.modules.results
    allPrivilegesQuery.data?.modules?.results?.forEach((p) => {
      map.set(p.module, {
        can_view: p.can_view,
        can_add: p.can_add,
        can_edit: p.can_edit,
        can_delete: p.can_delete,
      });
    });
    return map;
  }, [allPrivilegesQuery.data]);

  const submodulePrivilegesMap = useMemo(() => {
    const map = new Map<number, PrivilegeBase>();
    // CORRECTED: Access data.submodules.results
    allPrivilegesQuery.data?.submodules?.results?.forEach((p) => {
      map.set(p.submodule, {
        can_view: p.can_view,
        can_add: p.can_add,
        can_edit: p.can_edit,
        can_delete: p.can_delete,
      });
    });
    return map;
  }, [allPrivilegesQuery.data]);

  const functionalityPrivilegesMap = useMemo(() => {
    const map = new Map<number, PrivilegeBase>();
    // CORRECTED: Access data.functionalities.results
    allPrivilegesQuery.data?.functionalities?.results?.forEach((p) => {
      map.set(p.functionality, {
        can_view: p.can_view,
        can_add: p.can_add,
        can_edit: p.can_edit,
        can_delete: p.can_delete,
      });
    });
    return map;
  }, [allPrivilegesQuery.data]);
  
  const handlePrivilegeUpdate = (
    entityId: number, // Use a generic name
    key: keyof PrivilegeBase,
    value: boolean
  ) => {
    if (!selectedRoleId) return;

    if (activeTab === "modules") {
      const currentPrivs = modulePrivilegesMap.get(entityId) || defaultPrivs;
      const payload = {
        role: selectedRoleId,
        module: entityId,
        ...currentPrivs,
        [key]: value,
      };
      setModulePrivilegeMutation.mutate(payload);
    } else if (activeTab === "submodules") {
      const currentPrivs = submodulePrivilegesMap.get(entityId) || defaultPrivs;
      const payload = {
        role: selectedRoleId,
        submodule: entityId,
        ...currentPrivs,
        [key]: value,
      };
      setSubmodulePrivilegeMutation.mutate(payload);
    } else {
      const currentPrivs =
        functionalityPrivilegesMap.get(entityId) || defaultPrivs;
      const payload = {
        role: selectedRoleId,
        functionality: entityId,
        ...currentPrivs,
        [key]: value,
      };
      setFunctionalityPrivilegeMutation.mutate(payload);
    }
  };

  // Role CRUD handlers (Unchanged)
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await createRoleMutation.mutateAsync({
        name: newRoleName,
        description: newRoleDesc,
        is_active: newRoleIsActive,
      });
      setNewRoleName("");
      setNewRoleDesc("");
      setNewRoleIsActive(true);
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to create role:", err);
    }
  };

  const handleOpenEditDialog = (role: Role) => {
    setEditingRole({ ...role });
    setIsEditOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      await updateRoleMutation.mutateAsync({
        id: editingRole.id,
        data: {
          name: editingRole.name,
          description: editingRole.description,
          is_active: editingRole.is_active,
        },
      });
      setIsEditOpen(false);
      setEditingRole(null);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleOpenDeactivateAlert = (role: Role) => {
    setRoleToDeactivate(role);
    setIsDeactivateAlertOpen(true);
  };

  const handleDeactivateRole = async () => {
    if (!roleToDeactivate) return;
    try {
      await deactivateRoleMutation.mutateAsync(roleToDeactivate.id);
      if (selectedRoleId === roleToDeactivate.id) {
        setSelectedRoleId(null);
      }
      setIsDeactivateAlertOpen(false);
      setRoleToDeactivate(null);
    } catch (err) {
      console.error("Failed to deactivate role:", err);
    }
  };

  // Combine loading states for a better UX
  const isPrivilegesLoading =
    modulesQuery.isLoading ||
    allPrivilegesQuery.isLoading ||
    submodulesQuery.isLoading ||
    functionalitiesQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* --- Header and Role CRUD Dialogs (Unchanged UI) --- */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Roles & Privileges</h3>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

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
                onCheckedChange={(checked) =>
                  setNewRoleIsActive(Boolean(checked))
                }
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
            <Button
              onClick={handleCreateRole}
              disabled={createRoleMutation.isPending}
            >
              {createRoleMutation.isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                onChange={(e) =>
                  setEditingRole({ ...editingRole, name: e.target.value })
                }
              />
              <Input
                placeholder="Role Description"
                value={editingRole.description || ""}
                onChange={(e) =>
                  setEditingRole({
                    ...editingRole,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active_edit"
                  checked={editingRole.is_active}
                  onCheckedChange={(checked) =>
                    setEditingRole({
                      ...editingRole,
                      is_active: Boolean(checked),
                    })
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
              <Button
                onClick={handleUpdateRole}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog
        open={isDeactivateAlertOpen}
        onOpenChange={setIsDeactivateAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the role "{roleToDeactivate?.name}". This
              action cannot be undone, but the role can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateRole}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deactivateRoleMutation.isPending}
            >
              {deactivateRoleMutation.isPending
                ? "Deactivating..."
                : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Main Layout: Roles List and Privileges Panel --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">System Roles</h4>
          {rolesQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : roles.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No roles found. Create one to begin.
            </p>
          ) : (
            roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-colors ${
                  selectedRoleId === role.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <h5 className="font-medium">{role.name}</h5>
                      {!role.is_active && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDialog(role);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      {role.is_active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeactivateAlert(role);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description || "No description."}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* --- Privileges Panel --- */}
        <div>
          {selectedRoleId ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Set Privileges:{" "}
                  {roles.find((r) => r.id === selectedRoleId)?.name}
                </CardTitle>
                <CardDescription>
                  Changes are saved automatically when you toggle a permission.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={activeTab === "modules" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("modules")}
                  >
                    Modules
                  </Button>
                  <Button
                    variant={activeTab === "submodules" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("submodules")}
                  >
                    Submodules
                  </Button>
                  <Button
                    variant={
                      activeTab === "functionalities" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setActiveTab("functionalities")}
                  >
                    Functionalities
                  </Button>
                </div>

                {/* --- MODULES TAB --- */}
                {activeTab === "modules" && (
                  <>
                    {isPrivilegesLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {modulesQuery.data?.map((module: Module) => (
                          <div
                            key={module.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center flex-wrap gap-4">
                              <h4 className="font-semibold">{module.name}</h4>
                              <PermissionSwitches
                                entityId={`mod-${module.id}`}
                                privileges={
                                  modulePrivilegesMap.get(module.id) ||
                                  defaultPrivs
                                }
                                onUpdate={(key, value) =>
                                  handlePrivilegeUpdate(module.id, key, value)
                                }
                                isLoading={
                                  setModulePrivilegeMutation.isPending
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* --- SUBMODULES TAB --- */}
                {activeTab === "submodules" && (
                  <>
                    {isPrivilegesLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {submodulesQuery.data?.map((sub: Submodule) => (
                          <div key={sub.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                              <h4 className="font-semibold">{sub.name}</h4>
                              <PermissionSwitches
                                entityId={`sub-${sub.id}`}
                                privileges={
                                  submodulePrivilegesMap.get(sub.id) ||
                                  defaultPrivs
                                }
                                onUpdate={(key, value) =>
                                  handlePrivilegeUpdate(sub.id, key, value)
                                }
                                isLoading={
                                  setSubmodulePrivilegeMutation.isPending
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* --- FUNCTIONALITIES TAB --- */}
                {activeTab === "functionalities" && (
                  <>
                    {isPrivilegesLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {functionalitiesQuery.data?.map((func: Functionality) => (
                          <div
                            key={func.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center flex-wrap gap-4">
                              <h4 className="font-semibold">{func.name}</h4>
                              <PermissionSwitches
                                entityId={`func-${func.id}`}
                                privileges={
                                  functionalityPrivilegesMap.get(func.id) ||
                                  defaultPrivs
                                }
                                onUpdate={(key, value) =>
                                  handlePrivilegeUpdate(func.id, key, value)
                                }
                                isLoading={
                                  setFunctionalityPrivilegeMutation.isPending
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center h-full flex flex-col justify-center items-center">
                <LockKeyhole className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Role</h3>
                <p className="text-muted-foreground">
                  Choose a role from the left to view and manage its
                  privileges.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}