'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePrivileges } from '@/hooks/usePrivilegesLoad'; // Your existing hook

/**
 * Transforms the flat API data into a nested, UI-friendly structure.
 * It now correctly handles modules that are direct links and modules that are dropdowns.
 */
const buildNavigationTree = (data: any) => {
  if (!data || !data.modules || !data.submodules) {
    return new Map();
  }

  // The new, more flexible structure for our navigation map
  const navigationTree = new Map<string, {
    name: string;
    type: 'dropdown' | 'link'; // Identifies the module type
    submodules: any[];
  }>();

  // 1. Group all viewable submodules by their parent module name for efficient lookup.
  const submodulesByModule = new Map<string, any[]>();
  data.submodules.results.forEach((sub: any) => {
    if (sub.can_view) {
      if (!submodulesByModule.has(sub.module_name)) {
        submodulesByModule.set(sub.module_name, []);
      }
      submodulesByModule.get(sub.module_name)?.push({
        id: sub.id,
        submoduleId: sub.submodule, // The crucial ID for our dynamic route
        name: sub.submodule_name,
      });
    }
  });

  // 2. Use a Set to prevent processing duplicate module names from the API response.
  const processedModules = new Set<string>();

  data.modules.results.forEach((mod: any) => {
    if (!mod.can_view || processedModules.has(mod.module_name)) {
      return; // Skip if user can't view or we've already handled this module name
    }

    const submodulesForThisModule = submodulesByModule.get(mod.module_name) || [];

    if (submodulesForThisModule.length > 0) {
      // 3. If submodules exist, this is a 'dropdown' type.
      navigationTree.set(mod.module_name, {
        name: mod.module_name,
        type: 'dropdown',
        submodules: submodulesForThisModule,
      });
    } else {
      // 4. If no submodules exist, this is a 'link' type.
      navigationTree.set(mod.module_name, {
        name: mod.module_name,
        type: 'link',
        submodules: [], // It has no submodules
      });
    }
    
    // Mark as processed to handle duplicates
    processedModules.add(mod.module_name);
  });

  return navigationTree;
};


// --- The rest of the provider remains the same ---

const PrivilegeContext = createContext<any>(null);

export const PrivilegeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: privilegesData, isLoading } = usePrivileges();

  const navigationTree = useMemo(() => {
    return buildNavigationTree(privilegesData);
  }, [privilegesData]);

  const value = {
    isLoading,
    privilegesData, // You can still pass the raw data if needed elsewhere
    navigationTree,
  };
  
  return (
    <PrivilegeContext.Provider value={value}>
      {children}
    </PrivilegeContext.Provider>
  );
};

export const usePrivilegeContext = () => {
  const context = useContext(PrivilegeContext);
  if (!context) {
    throw new Error('usePrivilegeContext must be used within a PrivilegeProvider');
  }
  return context;
};