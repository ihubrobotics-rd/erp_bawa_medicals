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
// Button is no longer needed here for loading, but ModuleAccordion will use it.
import { ModuleAccordion } from "./ModuleAccordion";

// --- HOOKS ---
import { usePrivileges } from "@/hooks/usePrivileges";

// --- TYPES ---
import type { Role } from "@/lib/api/roles";
import type { SubmodulePrivilege, FunctionalityPrivilege } from "@/types/privileges";
import { PrivilegeBase } from "./PermissionSwitches";


interface PrivilegesPanelProps {
  selectedRoleId: number | null;
  roles: Role[];
}

export function PrivilegesPanel({ selectedRoleId, roles }: PrivilegesPanelProps) {
  const {
    allPrivilegesQuery,
    setSubmodulePrivilegeMutation,
    setFunctionalityPrivilegeMutation,
  } = usePrivileges(selectedRoleId);

  // Data processing logic remains the same...
  const { uniqueModulePrivileges, submodulesByModule, functionalitiesBySubmodule } = useMemo(() => {
    const allPages = allPrivilegesQuery.data?.pages || [];
    
    const uniqueModulesMap = new Map();
    allPages.flatMap(p => p.modules.results).forEach(m => {
        if (!uniqueModulesMap.has(m.module)) uniqueModulesMap.set(m.module, m);
    });

    const uniqueSubmodulesMap = new Map<number, SubmodulePrivilege>();
    allPages.flatMap(p => p.submodules.results).forEach(s => {
        if (!uniqueSubmodulesMap.has(s.id)) uniqueSubmodulesMap.set(s.id, s);
    });

    const uniqueFunctionalitiesMap = new Map<number, FunctionalityPrivilege>();
    allPages.flatMap(p => p.functionalities.results).forEach(f => {
        if (!uniqueFunctionalitiesMap.has(f.id)) uniqueFunctionalitiesMap.set(f.id, f);
    });

    const submodulesByModule = new Map<string, SubmodulePrivilege[]>();
    uniqueSubmodulesMap.forEach(sub => {
        const moduleName = sub.module_name;
        if (!submodulesByModule.has(moduleName)) submodulesByModule.set(moduleName, []);
        submodulesByModule.get(moduleName)?.push(sub);
    });
    
    const functionalitiesBySubmodule = new Map<string, FunctionalityPrivilege[]>();
    uniqueFunctionalitiesMap.forEach(func => {
        const submoduleName = func.submodule_name;
        if (!functionalitiesBySubmodule.has(submoduleName)) functionalitiesBySubmodule.set(submoduleName, []);
        functionalitiesBySubmodule.get(submoduleName)?.push(func);
    });

    return {
        uniqueModulePrivileges: Array.from(uniqueModulesMap.values()),
        submodulesByModule,
        functionalitiesBySubmodule,
    }
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
      <CardHeader>
        <CardTitle>Set Privileges: {selectedRole?.name}</CardTitle>
        <CardDescription>
          Click on a module to manage its permissions. Changes are saved automatically.
        </CardDescription>
      </CardHeader>
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
              isSubmoduleLoading={setSubmodulePrivilegeMutation.isPending}
              isFunctionalityLoading={setFunctionalityPrivilegeMutation.isPending}
              // --- ADDED: Pass API fetching capabilities down ---
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