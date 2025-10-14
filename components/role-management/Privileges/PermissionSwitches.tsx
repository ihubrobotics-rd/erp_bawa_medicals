"use client";

import { Switch } from "@/components/ui/switch";

// Base type for permissions
export type PrivilegeBase = {
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

// Helper component for rendering permission switches
export const PermissionSwitches = ({
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