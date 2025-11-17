"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleList } from "./RoleList";
import { PrivilegesPanel } from "./Privileges/PrivilegesPanel";
import { CreateRoleDialog } from "./RoleDialogs/CreateRoleDialog";
import { EditRoleDialog } from "./RoleDialogs/EditRoleDialog";
import { DeactivateRoleDialog } from "./RoleDialogs/DeactivateRoleDialog";
import { useRoles } from "@/hooks/useRoles";
import type { Role, CreateRolePayload } from "@/lib/api/roles";

export function RoleManagement() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null);
  const {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deactivateRoleMutation,
  } = useRoles();
  const roles: Role[] = rolesQuery.data || [];

  const handleCreateRole = async (data: CreateRolePayload) => {
    await createRoleMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleOpenEditDialog = (role: Role) => {
    setEditingRole(role);
    setIsEditOpen(true);
  };

  const handleUpdateRole = async (role: Role) => {
    await updateRoleMutation.mutateAsync({
      id: role.id,
      data: {
        name: role.name,
        description: role.description,
        is_active: role.is_active,
      },
    });
    setIsEditOpen(false);
    setEditingRole(null);
  };

  const handleOpenDeactivateAlert = (role: Role) => {
    setRoleToDeactivate(role);
    setIsDeactivateAlertOpen(true);
  };

  const handleDeactivateRole = async () => {
    if (!roleToDeactivate) return;
    await deactivateRoleMutation.mutateAsync(roleToDeactivate.id);
    if (selectedRoleId === roleToDeactivate.id) {
      setSelectedRoleId(null);
    }
    setIsDeactivateAlertOpen(false);
    setRoleToDeactivate(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Roles & Privileges</h3>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <CreateRoleDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateRole={handleCreateRole}
        isPending={createRoleMutation.isPending}
      />
      <EditRoleDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        role={editingRole}
        onUpdateRole={handleUpdateRole}
        isPending={updateRoleMutation.isPending}
      />
      <DeactivateRoleDialog
        isOpen={isDeactivateAlertOpen}
        onOpenChange={setIsDeactivateAlertOpen}
        role={roleToDeactivate}
        onConfirm={handleDeactivateRole}
        isPending={deactivateRoleMutation.isPending}
      />

  <div className="grid lg:grid-cols-2 gap-6 h-[80vh]">

    {/* LEFT SIDE */}
    <div className="flex flex-col overflow-hidden">
    <h4 className="font-medium sticky top-0 bg-white z-10 py-2">
      System Roles
    </h4>

    <div className="overflow-y-auto mt-2 p-6" >
      <RoleList
        roles={roles}
        isLoading={rolesQuery.isLoading}
        selectedRoleId={selectedRoleId}
        onSelectRole={setSelectedRoleId}
        onEdit={handleOpenEditDialog}
        onDeactivate={handleOpenDeactivateAlert}
      />
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex flex-col overflow-hidden">
    <h4 className="font-medium sticky top-0 bg-white z-10 py-2">
      Privileges
    </h4>

    <div className="overflow-y-auto mt-2">
      <PrivilegesPanel 
        selectedRoleId={selectedRoleId} 
        roles={roles} 
      />
    </div>
  </div>

</div>

    </div>
  );
}