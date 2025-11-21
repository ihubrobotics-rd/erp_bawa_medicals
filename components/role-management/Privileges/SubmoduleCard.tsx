"use client";

import { PermissionSwitches, PrivilegeBase } from "./PermissionSwitches";
import { FunctionalityRow } from "./FunctionalityRow";
import type { SubmodulePrivilege, FunctionalityPrivilege } from "@/types/privileges";

interface SubmoduleCardProps {
    subPriv: SubmodulePrivilege;
    functionalities: FunctionalityPrivilege[];

    // 🔥 ADDED PROP
    hasFunctionalities: boolean;

    onSubmoduleUpdate: (
        privilege: SubmodulePrivilege,
        key: keyof PrivilegeBase,
        value: boolean
    ) => void;

    onFunctionalityUpdate: (
        privilege: FunctionalityPrivilege,
        key: keyof PrivilegeBase,
        value: boolean
    ) => void;

    isSubmoduleLoading: boolean;
    isFunctionalityLoading: boolean;
     editMode?: boolean;
}

export const SubmoduleCard = ({ 
    subPriv,
    functionalities,

    // 🔥 ADDED
    hasFunctionalities,

    onSubmoduleUpdate,
    onFunctionalityUpdate,
    isSubmoduleLoading,
    isFunctionalityLoading,
    // ⭐ CHANGE
    editMode = false
}: SubmoduleCardProps) => {
    return (
        <div className="border rounded-lg p-3 bg-background">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h4 className="font-medium text-sm">
                    {subPriv.submodule_name}
                </h4>
                <PermissionSwitches
                entityId={`sub-${subPriv.submodule}`}
                privileges={subPriv}
                hideAdvanced={hasFunctionalities}
                onUpdate={(key, value) => {
                    if (!editMode) return;         // ⭐ CHANGE — block action
                    onSubmoduleUpdate(subPriv, key, value);
                }}
                isLoading={isSubmoduleLoading || !editMode} // ⭐ CHANGE — disable switches
                disabled={!editMode}                        // ⭐ CHANGE
                />

            </div>
            
            {functionalities && functionalities.length > 0 && (
                <div className="mt-3 pt-3 pl-4 border-t space-y-2">
                    {functionalities.map(funcPriv => (
                        <FunctionalityRow
                            key={funcPriv.id}
                            funcPriv={funcPriv}
                            onUpdate={onFunctionalityUpdate}
                            isLoading={isFunctionalityLoading}
                            editMode={editMode}   // ⭐ IMPORTANT LINE
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
