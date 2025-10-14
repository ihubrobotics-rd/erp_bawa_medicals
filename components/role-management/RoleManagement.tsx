"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- CHILD COMPONENTS ---
import { RoleList } from "./RoleList";
import { PrivilegesPanel } from "./Privileges/PrivilegesPanel";
import { CreateRoleDialog } from "./RoleDialogs/CreateRoleDialog";
import { EditRoleDialog } from "./RoleDialogs/EditRoleDialog";
import { DeactivateRoleDialog } from "./RoleDialogs/DeactivateRoleDialog";

// --- HOOKS ---
import { useRoles } from "@/hooks/useRoles";

// --- TYPES ---
import type { Role } from "@/lib/api/roles";

export function RoleManagement() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateAlertOpen, setIsDeactivateAlertOpen] = useState(false);
  
  // State for which role is being acted upon
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null);

  const {
    rolesQuery,
    createRoleMutation,
    updateRoleMutation,
    deactivateRoleMutation,
  } = useRoles();

  const roles: Role[] = rolesQuery.data || [];

  // --- HANDLERS FOR DIALOGS ---
  const handleCreateRole = async (data: Omit<Role, 'id'>) => {
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">System Roles</h4>
          <RoleList
            roles={roles}
            isLoading={rolesQuery.isLoading}
            selectedRoleId={selectedRoleId}
            onSelectRole={setSelectedRoleId}
            onEdit={handleOpenEditDialog}
            onDeactivate={handleOpenDeactivateAlert}
          />
        </div>

        <PrivilegesPanel selectedRoleId={selectedRoleId} roles={roles} />
      </div>
    </div>
  );
}