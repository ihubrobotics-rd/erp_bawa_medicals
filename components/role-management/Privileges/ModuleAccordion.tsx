"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmoduleCard } from "./SubmoduleCard";
import type {
    ModulePrivilege,
    SubmodulePrivilege,
    FunctionalityPrivilege,
} from "@/types/privileges";
import { PrivilegeBase } from "./PermissionSwitches";

const INITIAL_VISIBLE_SUBMODULES = 8;
const SHOW_MORE_INCREMENT = 10;

interface ModuleAccordionProps {
    modules: ModulePrivilege[];
    submodulesByModule: Map<string, SubmodulePrivilege[]>;
    functionalitiesBySubmodule: Map<string, FunctionalityPrivilege[]>;
    handleSubmoduleUpdate: (
        privilege: SubmodulePrivilege,
        key: keyof PrivilegeBase,
        value: boolean
    ) => void;
    handleFunctionalityUpdate: (
        privilege: FunctionalityPrivilege,
        key: keyof PrivilegeBase,
        value: boolean
    ) => void;
    isSubmoduleLoading: boolean;
    isFunctionalityLoading: boolean;
    isModuleLoading?: boolean;
    handleModuleViewToggle?: (
        modulePriv: ModulePrivilege,
        value: boolean
    ) => void;
    // --- ADDED: Props for smart loading ---
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    editMode?: boolean;
}

export const ModuleAccordion = ({
    modules,
    submodulesByModule,
    functionalitiesBySubmodule,
    handleSubmoduleUpdate,
    handleFunctionalityUpdate,
    isSubmoduleLoading,
    isFunctionalityLoading,
    isModuleLoading,
    handleModuleViewToggle,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    editMode,
}: ModuleAccordionProps) => {
    const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
        {}
    );

    const handleShowMore = (moduleId: string, currentLoadedCount: number) => {
        const newVisibleCount =
            (visibleCounts[moduleId] || INITIAL_VISIBLE_SUBMODULES) +
            SHOW_MORE_INCREMENT;

        // Update UI immediately to show more of what we have
        setVisibleCounts((prev) => ({ ...prev, [moduleId]: newVisibleCount }));

        // If user wants to see more than we've loaded and there's a next page, fetch it.
        if (
            newVisibleCount > currentLoadedCount &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    };

    const handleShowLess = (moduleId: string) => {
        setVisibleCounts((prev) => ({
            ...prev,
            [moduleId]: INITIAL_VISIBLE_SUBMODULES,
        }));
    };

    return (
        <Accordion type="single" collapsible className="w-full">
            {modules.map((modulePriv) => {
                const moduleId = String(modulePriv.module);
                const allSubmodulesForModule =
                    submodulesByModule.get(modulePriv.module_name) || [];
                const currentVisibleCount =
                    visibleCounts[moduleId] || INITIAL_VISIBLE_SUBMODULES;
                const visibleSubmodules = allSubmodulesForModule.slice(
                    0,
                    currentVisibleCount
                );

                // Determine if the "Show More" button should be a data loader
                const canLoadMoreData =
                    hasNextPage &&
                    allSubmodulesForModule.length <= currentVisibleCount;

                return (
                    <AccordionItem key={moduleId} value={`module-${moduleId}`}>
                        <AccordionTrigger className="font-semibold hover:no-underline px-4">
                            <div className="flex items-center justify-between w-full">
                                <span>{modulePriv.module_name}</span>
                                {typeof handleModuleViewToggle ===
                                    "function" && (
                                    <div
                                        className="ml-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            id={`module-view-${moduleId}`}
                                            checked={!!modulePriv.can_view}
                                            onCheckedChange={(v:any) => {
                                                if (!editMode) return;
                                                handleModuleViewToggle(
                                                    modulePriv,
                                                    !!v
                                                );
                                            }}
                                            disabled={
                                                !!isModuleLoading || !editMode
                                            }
                                            className="h-4 w-4"
                                        />
                                    </div>
                                )}
                            </div>
                        </AccordionTrigger>
                        {!editMode && (
                            <div className="px-4 text-xs text-muted-foreground">
                                Enable "Manage Privileges" to edit module
                                permissions.
                            </div>
                        )}
                        <AccordionContent className="bg-muted/40 p-1">
                            <div className="space-y-2 p-3 max-h-[450px] overflow-y-auto">
                                {allSubmodulesForModule.length > 0 ? (
                                    <>
                                        {visibleSubmodules.map((subPriv) => {
                                            // 🔥 ADDED LINE — check if this submodule has functionalities
                                            const hasFunctionalities =
                                                (
                                                    functionalitiesBySubmodule.get(
                                                        subPriv.submodule_name!
                                                    ) || []
                                                ).length > 0;

                                            return (
                                                <SubmoduleCard
                                                    key={subPriv.id}
                                                    subPriv={subPriv}
                                                    functionalities={
                                                        functionalitiesBySubmodule.get(
                                                            subPriv.submodule_name!
                                                        ) || []
                                                    }
                                                    // 🔥 ADDED LINE — pass it to SubmoduleCard
                                                    hasFunctionalities={
                                                        hasFunctionalities
                                                    }
                                                    onSubmoduleUpdate={
                                                        handleSubmoduleUpdate
                                                    }
                                                    onFunctionalityUpdate={
                                                        handleFunctionalityUpdate
                                                    }
                                                    isSubmoduleLoading={
                                                        isSubmoduleLoading
                                                    }
                                                    isFunctionalityLoading={
                                                        isFunctionalityLoading
                                                    }
                                                    editMode={editMode}
                                                />
                                            );
                                        })}

                                        {/* Show More / Show Less Controls */}
                                        <div className="text-center pt-2 space-x-4">
                                            {/* Show More button only if we still have more submodules to display */}
                                            {currentVisibleCount <
                                                allSubmodulesForModule.length && (
                                                <Button
                                                    variant="link"
                                                    className="h-auto p-1"
                                                    onClick={() =>
                                                        handleShowMore(
                                                            moduleId,
                                                            allSubmodulesForModule.length
                                                        )
                                                    }
                                                    disabled={
                                                        isFetchingNextPage
                                                    }
                                                >
                                                    {isFetchingNextPage
                                                        ? "Loading..."
                                                        : "Show More"}
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center p-4">
                                        No submodules found for this module.
                                    </p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};
