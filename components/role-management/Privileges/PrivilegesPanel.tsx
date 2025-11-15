"use client";

import { useMemo } from "react";
import { LockKeyhole } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleAccordion } from "./ModuleAccordion";
import { usePrivileges } from "@/hooks/usePrivileges";
import type { Role } from "@/lib/api/roles";
import type {
  SubmodulePrivilege,
  FunctionalityPrivilege,
} from "@/types/privileges";
import { PrivilegeBase } from "./PermissionSwitches";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PrivilegesPanelProps {
  selectedRoleId: number | null;
  roles: Role[];
}

export function PrivilegesPanel({
  selectedRoleId,
  roles,
}: PrivilegesPanelProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    allPrivilegesQuery,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
    setModulePrivilegeMutation,
  } = usePrivileges(selectedRoleId);

  // Data processing logic remains the same...
  const {
    uniqueModulePrivileges,
    submodulesByModule,
    functionalitiesBySubmodule,
  } = useMemo(() => {
    const allPages = allPrivilegesQuery.data?.pages || [];

    const uniqueModulesMap = new Map();
    allPages
      .flatMap((p) => p.modules.results)
      .forEach((m) => {
        if (!uniqueModulesMap.has(m.module)) uniqueModulesMap.set(m.module, m);
      });

    const uniqueSubmodulesMap = new Map<number, SubmodulePrivilege>();
    allPages
      .flatMap((p) => p.submodules.results)
      .forEach((s) => {
        if (!uniqueSubmodulesMap.has(s.id)) uniqueSubmodulesMap.set(s.id, s);
      });

    const uniqueFunctionalitiesMap = new Map<number, FunctionalityPrivilege>();
    allPages
      .flatMap((p) => p.functionalities.results)
      .forEach((f) => {
        if (!uniqueFunctionalitiesMap.has(f.id))
          uniqueFunctionalitiesMap.set(f.id, f);
      });

    const submodulesByModule = new Map<string, SubmodulePrivilege[]>();
    uniqueSubmodulesMap.forEach((sub) => {
      // API returns `module_name` on submodule objects, but our TS type may not include it.
      const moduleName = (sub as any).module_name || "(No module)";
      if (!submodulesByModule.has(moduleName))
        submodulesByModule.set(moduleName, []);
      submodulesByModule.get(moduleName)?.push(sub);
    });

    const functionalitiesBySubmodule = new Map<
      string,
      FunctionalityPrivilege[]
    >();
    uniqueFunctionalitiesMap.forEach((func) => {
      const submoduleName = func.submodule_name;
      if (!functionalitiesBySubmodule.has(submoduleName))
        functionalitiesBySubmodule.set(submoduleName, []);
      functionalitiesBySubmodule.get(submoduleName)?.push(func);
    });

    return {
      uniqueModulePrivileges: Array.from(uniqueModulesMap.values()),
      submodulesByModule,
      functionalitiesBySubmodule,
    };
  }, [allPrivilegesQuery.data]);
  
  // Event handlers remain the same...
  const handleSubmodulePrivilegeUpdate = (
    privilege: SubmodulePrivilege,
    key: keyof PrivilegeBase,
    value: boolean
  ) => {
    if (!selectedRoleId) return;
    setSubmodulePrivilegeMutation.mutate({
      ...privilege,
      role: selectedRoleId,
      [key]: value,
    });
  };

  // Module-level 'view' toggle handler (only can_view should be exposed for modules)
  const handleModuleViewToggle = (
    modulePriv: any, // ModulePrivilege
    value: boolean
  ) => {
    if (!selectedRoleId) return;
    // API expects: { role, module, can_view, can_add, can_edit, can_delete }
    // We'll send only the module id, role and can_view; backend should default others to false
    setModulePrivilegeMutation.mutate({
      role: selectedRoleId,
      module: modulePriv.module,
      can_view: value,
      can_add: false,
      can_edit: false,
      can_delete: false,
    });
  };

  const handleFunctionalityPrivilegeUpdate = (
    privilege: FunctionalityPrivilege,
    key: keyof PrivilegeBase,
    value: boolean
  ) => {
    if (!selectedRoleId) return;
    setFunctionalityPrivilegeMutation.mutate({
      ...privilege,
      role: selectedRoleId,
      [key]: value,
    });
  };

  // Render logic...
  if (!selectedRoleId) {
    return (
      <Card>
        <CardContent className="p-8 text-center h-full flex flex-col justify-center items-center">
          <LockKeyhole className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a Role</h3>
          <p className="text-muted-foreground">
            Choose a role from the left to view and manage its privileges.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  return (
   <Card>
  {/* ⭐ STICKY HEADER START ⭐ */}
  <div className="sticky top-0 z-20 bg-white border-b">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Set Privileges: {selectedRole?.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isEditMode ? "destructive" : "outline"}
            onClick={() => setIsEditMode((v) => !v)}
          >
            {isEditMode ? "Exit Edit" : "Manage Privileges"}
          </Button>
        </div>
      </div>

      <CardDescription>
        Click on a module to manage its permissions. Changes are saved
        automatically.
      </CardDescription>
    </CardHeader>
  </div>
  {/* ⭐ STICKY HEADER END ⭐ */}

  <CardContent>
    {allPrivilegesQuery.isLoading ? (
      <div className="space-y-2 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    ) : uniqueModulePrivileges.length > 0 ? (
      <ModuleAccordion
        modules={uniqueModulePrivileges}
        submodulesByModule={submodulesByModule}
        functionalitiesBySubmodule={functionalitiesBySubmodule}
        handleSubmoduleUpdate={handleSubmodulePrivilegeUpdate}
        handleFunctionalityUpdate={handleFunctionalityPrivilegeUpdate}
        handleModuleViewToggle={handleModuleViewToggle}
        isSubmoduleLoading={setSubmodulePrivilegeMutation.isPending}
        isFunctionalityLoading={setFunctionalityPrivilegeMutation.isPending}
        isModuleLoading={setModulePrivilegeMutation.isPending}
        editMode={isEditMode}
        hasNextPage={allPrivilegesQuery.hasNextPage}
        isFetchingNextPage={allPrivilegesQuery.isFetchingNextPage}
        fetchNextPage={() => allPrivilegesQuery.fetchNextPage()}
      />
    ) : (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          No privileges found for this role.
        </p>
      </div>
    )}
  </CardContent>
</Card>

  );
}
