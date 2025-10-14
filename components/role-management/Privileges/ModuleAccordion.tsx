"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SubmoduleCard } from "./SubmoduleCard";
import type { ModulePrivilege, SubmodulePrivilege, FunctionalityPrivilege } from "@/types/privileges";
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
    // --- ADDED: Props for smart loading ---
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export const ModuleAccordion = ({
    modules,
    submodulesByModule,
    functionalitiesBySubmodule,
    handleSubmoduleUpdate,
    handleFunctionalityUpdate,
    isSubmoduleLoading,
    isFunctionalityLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: ModuleAccordionProps) => {
    const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

    const handleShowMore = (moduleId: string, currentLoadedCount: number) => {
        const newVisibleCount = (visibleCounts[moduleId] || INITIAL_VISIBLE_SUBMODULES) + SHOW_MORE_INCREMENT;

        // Update UI immediately to show more of what we have
        setVisibleCounts(prev => ({ ...prev, [moduleId]: newVisibleCount }));

        // If user wants to see more than we've loaded and there's a next page, fetch it.
        if (newVisibleCount > currentLoadedCount && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const handleShowLess = (moduleId: string) => {
        setVisibleCounts(prev => ({ ...prev, [moduleId]: INITIAL_VISIBLE_SUBMODULES }));
    };
    
    return (
         <Accordion type="single" collapsible className="w-full">
            {modules.map((modulePriv) => {
                const moduleId = String(modulePriv.module);
                const allSubmodulesForModule = submodulesByModule.get(modulePriv.module_name) || [];
                const currentVisibleCount = visibleCounts[moduleId] || INITIAL_VISIBLE_SUBMODULES;
                const visibleSubmodules = allSubmodulesForModule.slice(0, currentVisibleCount);
                
                // Determine if the "Show More" button should be a data loader
                const canLoadMoreData = hasNextPage && allSubmodulesForModule.length <= currentVisibleCount;

                return (
                    <AccordionItem
                        key={moduleId}
                        value={`module-${moduleId}`}
                    >
                        <AccordionTrigger className="font-semibold hover:no-underline px-4">
                            {modulePriv.module_name}
                        </AccordionTrigger>
                        <AccordionContent className="bg-muted/40 p-1">
                            <div className="space-y-2 p-3 max-h-[450px] overflow-y-auto">
                                {allSubmodulesForModule.length > 0 ? (
                                    <>
                                        {visibleSubmodules.map((subPriv) => (
                                            <SubmoduleCard
                                                key={subPriv.id}
                                                subPriv={subPriv}
                                                functionalities={functionalitiesBySubmodule.get(subPriv.submodule_name) || []}
                                                onSubmoduleUpdate={handleSubmoduleUpdate}
                                                onFunctionalityUpdate={handleFunctionalityUpdate}
                                                isSubmoduleLoading={isSubmoduleLoading}
                                                isFunctionalityLoading={isFunctionalityLoading}
                                            />
                                        ))}
                                        <div className="text-center pt-2 space-x-4">
                                            {/* --- UPGRADED: Smart "Show More" / "Load More" Button --- */}
                                            {(allSubmodulesForModule.length > currentVisibleCount || canLoadMoreData) && (
                                                <Button 
                                                    variant="link" 
                                                    className="h-auto p-1"
                                                    onClick={() => handleShowMore(moduleId, allSubmodulesForModule.length)}
                                                    disabled={isFetchingNextPage}
                                                >
                                                    {isFetchingNextPage ? "Loading..." : "Show More"}
                                                </Button>
                                            )}
                                            {currentVisibleCount > INITIAL_VISIBLE_SUBMODULES && (
                                                 <Button 
                                                    variant="link" 
                                                    className="h-auto p-1 text-muted-foreground"
                                                    onClick={() => handleShowLess(moduleId)}
                                                >
                                                    Show Less
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