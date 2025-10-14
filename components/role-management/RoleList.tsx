"use client";

import { Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Role } from "@/lib/api/roles";

interface RoleListProps {
  roles: Role[];
  isLoading: boolean;
  selectedRoleId: number | null;
  onSelectRole: (id: number) => void;
  onEdit: (role: Role) => void;
  onDeactivate: (role: Role) => void;
}

export function RoleList({
  roles,
  isLoading,
  selectedRoleId,
  onSelectRole,
  onEdit,
  onDeactivate,
}: RoleListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No roles found. Create one to begin.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <Card
          key={role.id}
          className={`cursor-pointer transition-colors ${
            selectedRoleId === role.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectRole(role.id)}
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
                    onEdit(role);
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
                      onDeactivate(role);
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
      ))}
    </div>
  );
}