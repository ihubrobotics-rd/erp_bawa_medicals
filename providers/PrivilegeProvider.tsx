// providers/PrivilegeProvider.tsx

'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { usePrivileges } from '@/hooks/usePrivilegesLoad'; // Your existing hook

// --- TYPE DEFINITIONS for clarity ---
type Functionality = {
  id: number;
  functionalityId: number;
  name: string;
  parentSubmoduleId: number; // The ID of the submodule page to link to
  type: 'functionality';
};

type Submodule = {
  id: number;
  submoduleId: number;
  name: string;
  functionalities: Functionality[];
  type: 'submodule';
};

type NavigationNode = {
  name: string;
  type: 'dropdown' | 'link';
  submodules: Submodule[];
};

// --- THE MODIFIED buildNavigationTree FUNCTION ---
const buildNavigationTree = (data: any): Map<string, NavigationNode> => {
  if (!data || !data.modules || !data.submodules) {
    return new Map();
  }

  const navigationTree = new Map<string, NavigationNode>();

  // 1. Create a lookup map for submodule names to their IDs for efficient linking.
  const submoduleNameToIdMap = new Map<string, number>();
  if (data.submodules && data.submodules.results) {
    data.submodules.results.forEach((sub: any) => {
        submoduleNameToIdMap.set(sub.submodule_name, sub.submodule);
    });
  }

  // 2. Group all viewable functionalities by their parent submodule name.
  const functionalitiesBySubmodule = new Map<string, Functionality[]>();
  if (data.functionalities && data.functionalities.results) {
    data.functionalities.results.forEach((func: any) => {
      if (func.can_view) {
        if (!functionalitiesBySubmodule.has(func.submodule_name)) {
          functionalitiesBySubmodule.set(func.submodule_name, []);
        }
        // Find the parent submodule's ID for linking
        const parentSubmoduleId = submoduleNameToIdMap.get(func.submodule_name);
        if (parentSubmoduleId) {
            functionalitiesBySubmodule.get(func.submodule_name)?.push({
                id: func.id,
                functionalityId: func.functionality,
                name: func.functionality_name,
                parentSubmoduleId: parentSubmoduleId, // Crucial for linking
                type: 'functionality',
            });
        }
      }
    });
  }

  // 3. Group all viewable submodules by their parent module name, attaching their functionalities.
  const submodulesByModule = new Map<string, Submodule[]>();
  if (data.submodules && data.submodules.results) {
      data.submodules.results.forEach((sub: any) => {
        if (sub.can_view) {
          if (!submodulesByModule.has(sub.module_name)) {
            submodulesByModule.set(sub.module_name, []);
          }
          submodulesByModule.get(sub.module_name)?.push({
            id: sub.id,
            submoduleId: sub.submodule,
            name: sub.submodule_name,
            functionalities: functionalitiesBySubmodule.get(sub.submodule_name) || [],
            type: 'submodule',
          });
        }
      });
  }


  // 4. Build the final navigation tree using the modules as the top level.
  const processedModules = new Set<string>();
  data.modules.results.forEach((mod: any) => {
    if (!mod.can_view || processedModules.has(mod.module_name)) {
      return;
    }

    const submodulesForThisModule = submodulesByModule.get(mod.module_name) || [];

    if (submodulesForThisModule.length > 0) {
      navigationTree.set(mod.module_name, {
        name: mod.module_name,
        type: 'dropdown',
        submodules: submodulesForThisModule,
      });
    } else {
      navigationTree.set(mod.module_name, {
        name: mod.module_name,
        type: 'link',
        submodules: [],
      });
    }
    
    processedModules.add(mod.module_name);
  });

  return navigationTree;
};


// --- CONTEXT AND PROVIDER (No changes needed here) ---
const PrivilegeContext = createContext<any>(null);

export const PrivilegeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: privilegesData, isLoading } = usePrivileges();

  const navigationTree = useMemo(() => {
    return buildNavigationTree(privilegesData);
  }, [privilegesData]);

  const value = {
    isLoading,
    privilegesData,
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