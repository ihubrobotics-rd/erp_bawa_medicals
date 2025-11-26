"use client";

import { useState } from "react";
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
import type { CreateRolePayload } from "@/lib/api/roles";

interface CreateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreateRole: (data: CreateRolePayload) => Promise<void>;
  isPending: boolean;
}

export function CreateRoleDialog({
  isOpen,
  onOpenChange,
  onCreateRole,
  isPending,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async () => {
    await onCreateRole({
      name,
      description,
      is_active: isActive,
    });
    // Reset form state on successful creation
    setName("");
    setDescription("");
    setIsActive(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Role Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active_create"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="is_active_create" className="cursor-pointer">
              Is Active
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending ? "Creating..." : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}