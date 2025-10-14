"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Role } from "@/lib/api/roles";

interface EditRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateRole: (role: Role) => Promise<void>;
  isPending: boolean;
  role: Role | null;
}

export function EditRoleDialog({
  isOpen,
  onOpenChange,
  onUpdateRole,
  isPending,
  role,
}: EditRoleDialogProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(role);

  useEffect(() => {
    setEditingRole(role);
  }, [role]);

  if (!editingRole) return null;

  const handleUpdate = () => {
    if (editingRole) {
      onUpdateRole(editingRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.name}</DialogTitle>
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
              setEditingRole({ ...editingRole, description: e.target.value })
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}