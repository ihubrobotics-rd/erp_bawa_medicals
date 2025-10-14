"use client";

import { PermissionSwitches, PrivilegeBase } from "./PermissionSwitches";
import type { FunctionalityPrivilege } from "@/types/privileges";

interface FunctionalityRowProps {
    funcPriv: FunctionalityPrivilege;
    onUpdate: (
        privilege: FunctionalityPrivilege,
        key: keyof PrivilegeBase,
        value: boolean
    ) => void;
    isLoading: boolean;
}

export const FunctionalityRow = ({ funcPriv, onUpdate, isLoading }: FunctionalityRowProps) => {
    return (
         <div
            key={funcPriv.id}
            className="flex justify-between items-center flex-wrap gap-4"
        >
            <p className="font-normal text-sm text-muted-foreground">
                {funcPriv.functionality_name}
            </p>
            <PermissionSwitches
                entityId={`func-${funcPriv.functionality}`}
                privileges={funcPriv}
                onUpdate={(key, value) => onUpdate(funcPriv, key, value)}
                isLoading={isLoading}
            />
        </div>
    )
}