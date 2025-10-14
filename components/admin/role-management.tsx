"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  Edit,
  Plus,
  Trash2,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { usePrivileges } from "@/hooks/usePrivileges";

// --- TYPES ---
import type { Role } from "@/lib/api/roles";
import type { SubmodulePrivilege, FunctionalityPrivilege } from "@/types/privileges";

// Base type for permissions
type PrivilegeBase = {
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

// Helper component for rendering permission switches
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleIsActive, setNewRoleIsActive] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
  const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null);

  const {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deactivateRoleMutation,
  } = useRoles();

  const {
    allPrivilegesQuery,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  } = usePrivileges(selectedRoleId);

  const roles: Role[] = rolesQuery.data || [];

  const uniqueModulePrivileges = useMemo(() => {
    const allModules = allPrivilegesQuery.data?.pages.flatMap(
        (page) => page.modules.results
    ) || [];
    const uniqueMap = new Map();
    allModules.forEach(mod => {
        if (!uniqueMap.has(mod.module)) {
            uniqueMap.set(mod.module, mod);
        }
    });
    return Array.from(uniqueMap.values());
  }, [allPrivilegesQuery.data]);

  const uniqueSubmodulePrivileges = useMemo(() => {
    const allSubmodules = allPrivilegesQuery.data?.pages.flatMap(
        (page) => page.submodules.results
      ) || [];
    const uniqueMap = new Map();
    allSubmodules.forEach(subPriv => {
        if (!uniqueMap.has(subPriv.id)) {
            uniqueMap.set(subPriv.id, subPriv);
        }
    });
    return Array.from(uniqueMap.values());
  }, [allPrivilegesQuery.data]);

  const uniqueFunctionalityPrivileges = useMemo(() => {
    const allFunctionalities = allPrivilegesQuery.data?.pages.flatMap(
        (page) => page.functionalities.results
    ) || [];
    const uniqueMap = new Map();
    allFunctionalities.forEach(funcPriv => {
        if (!uniqueMap.has(funcPriv.id)) {
            uniqueMap.set(funcPriv.id, funcPriv);
        }
    });
    return Array.from(uniqueMap.values());
  }, [allPrivilegesQuery.data]);

  const submodulesByModule = useMemo(() => {
    const grouped = new Map<string, SubmodulePrivilege[]>();
    uniqueSubmodulePrivileges.forEach((submodule) => {
      const moduleName = submodule.module_name;
      if (!grouped.has(moduleName)) {
        grouped.set(moduleName, []);
      }
      grouped.get(moduleName)?.push(submodule);
    });
    return grouped;
  }, [uniqueSubmodulePrivileges]);

  const functionalitiesBySubmodule = useMemo(() => {
    const grouped = new Map<string, FunctionalityPrivilege[]>();
    uniqueFunctionalityPrivileges.forEach((func) => {
        const submoduleName = func.submodule_name;
        if (!grouped.has(submoduleName)) {
            grouped.set(submoduleName, []);
        }
        grouped.get(submoduleName)?.push(func);
    });
    return grouped;
  }, [uniqueFunctionalityPrivileges]);

  const handleSubmodulePrivilegeUpdate = (
    submodulePrivilege: SubmodulePrivilege,
    key: keyof PrivilegeBase,
    value: boolean
  ) => {
    if (!selectedRoleId) return;
    const payload = {
      role: selectedRoleId,
      submodule: submodulePrivilege.submodule,
      can_view: submodulePrivilege.can_view,
      can_add: submodulePrivilege.can_add,
      can_edit: submodulePrivilege.can_edit,
      can_delete: submodulePrivilege.can_delete,
      [key]: value,
    };
    setSubmodulePrivilegeMutation.mutate(payload);
  };

  const handleFunctionalityPrivilegeUpdate = (
    functionalityPrivilege: FunctionalityPrivilege,
    key: keyof PrivilegeBase,
    value: boolean
  ) => {
    if (!selectedRoleId) return;
    const payload = {
        role: selectedRoleId,
        functionality: functionalityPrivilege.functionality,
        can_view: functionalityPrivilege.can_view,
        can_add: functionalityPrivilege.can_add,
        can_edit: functionalityPrivilege.can_edit,
        can_delete: functionalityPrivilege.can_delete,
        [key]: value,
    };
    setFunctionalityPrivilegeMutation.mutate(payload);
  };

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

  const isPrivilegesLoading = allPrivilegesQuery.isLoading;

  return (
    <div className="space-y-6">
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

        <div>
          {selectedRoleId ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Set Privileges:{" "}
                  {roles.find((r) => r.id === selectedRoleId)?.name}
                </CardTitle>
                <CardDescription>
                  Click on a module to view and manage its submodules. Changes
                  are saved automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPrivilegesLoading ? (
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : uniqueModulePrivileges.length > 0 ? (
                  <>
                    <Accordion type="single" collapsible className="w-full">
                      {uniqueModulePrivileges.map((modulePriv) => (
                        <AccordionItem
                          key={modulePriv.module}
                          value={`module-${modulePriv.module}`}
                        >
                          <AccordionTrigger className="font-semibold hover:no-underline px-4">
                            {modulePriv.module_name}
                          </AccordionTrigger>
                          <AccordionContent className="bg-muted/40 p-1">
                            <div className="space-y-2 p-3">
                              {submodulesByModule.has(modulePriv.module_name) ? (
                                submodulesByModule
                                  .get(modulePriv.module_name)!
                                  .map((subPriv) => (
                                    <div
                                      key={subPriv.id}
                                      className="border rounded-lg p-3 bg-background"
                                    >
                                      <div className="flex justify-between items-center flex-wrap gap-4">
                                        <h4 className="font-medium text-sm">
                                          {subPriv.submodule_name}
                                        </h4>
                                        <PermissionSwitches
                                          entityId={`sub-${subPriv.submodule}`}
                                          privileges={{
                                            can_view: subPriv.can_view,
                                            can_add: subPriv.can_add,
                                            can_edit: subPriv.can_edit,
                                            can_delete: subPriv.can_delete,
                                          }}
                                          onUpdate={(key, value) =>
                                            handleSubmodulePrivilegeUpdate(
                                              subPriv,
                                              key,
                                              value
                                            )
                                          }
                                          isLoading={
                                            setSubmodulePrivilegeMutation.isPending
                                          }
                                        />
                                      </div>
                                      
                                      {functionalitiesBySubmodule.has(subPriv.submodule_name) && (
                                        <div className="mt-3 pt-3 pl-4 border-t space-y-2">
                                          {functionalitiesBySubmodule
                                            .get(subPriv.submodule_name)!
                                            .map((funcPriv) => (
                                              <div
                                                key={funcPriv.id}
                                                className="flex justify-between items-center flex-wrap gap-4"
                                              >
                                                <p className="font-normal text-sm text-muted-foreground">
                                                  {funcPriv.functionality_name}
                                                </p>
                                                <PermissionSwitches
                                                  entityId={`func-${funcPriv.functionality}`}
                                                  privileges={{
                                                    can_view: funcPriv.can_view,
                                                    can_add: funcPriv.can_add,
                                                    can_edit: funcPriv.can_edit,
                                                    can_delete: funcPriv.can_delete,
                                                  }}
                                                  onUpdate={(key, value) => 
                                                    handleFunctionalityPrivilegeUpdate(
                                                      funcPriv,
                                                      key,
                                                      value
                                                    )
                                                  }
                                                  isLoading={
                                                    setFunctionalityPrivilegeMutation.isPending
                                                  }
                                                />
                                              </div>
                                            ))
                                          }
                                        </div>
                                      )}
                                    </div>
                                  ))
                              ) : (
                                <p className="text-sm text-muted-foreground text-center p-4">
                                  No submodules found for this module.
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <div className="mt-6 text-center">
                      {allPrivilegesQuery.hasNextPage && (
                        <Button
                          onClick={() => allPrivilegesQuery.fetchNextPage()}
                          disabled={allPrivilegesQuery.isFetchingNextPage}
                          variant="outline"
                        >
                          {allPrivilegesQuery.isFetchingNextPage
                            ? "Loading More..."
                            : "Load More"}
                        </Button>
                      )}
                    </div>

                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No modules have been assigned privileges for this role.
                    </p>
                  </div>
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