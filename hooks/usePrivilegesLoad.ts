// hooks/usePrivileges.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api, { getRoleId } from "@/lib/api/auth";

// Helper type for clarity
type PaginatedResult = {
  count: number;
  total_pages: number;
  results: any[];
  [key: string]: any; // for other properties like next, previous, etc.
};

// The new fetching function that handles pagination
const fetchAllPrivileges = async (roleId: string) => {
  const initialResponse = await api.get(
    `/privilege/role/privileges/${roleId}/`
  );
  const firstPageData = initialResponse.data.data;

  if (!firstPageData) {
    return {
      modules: { results: [] },
      submodules: { results: [] },
      functionalities: { results: [] },
    };
  }

  const { modules, submodules, functionalities } = firstPageData;

  // 2. Determine the maximum number of pages to fetch
  const maxTotalPages = Math.max(
    modules?.total_pages || 1,
    submodules?.total_pages || 1,
    functionalities?.total_pages || 1
  );

  // If there's only one page, no more fetching is needed
  if (maxTotalPages <= 1) {
    return firstPageData;
  }

  // 3. Create promises for all remaining pages
  const pagePromises = [];
  for (let page = 2; page <= maxTotalPages; page++) {
    pagePromises.push(
      api.get(`/privilege/role/privileges/${roleId}/?page=${page}`)
    );
  }

  // 4. Fetch all other pages concurrently
  const additionalPageResponses = await Promise.all(pagePromises);

  // 5. Aggregate the results from all pages
  const allModules = [...(modules?.results || [])];
  const allSubmodules = [...(submodules?.results || [])];
  const allFunctionalities = [...(functionalities?.results || [])];

  additionalPageResponses.forEach((response) => {
    const pageData = response.data.data;
    if (pageData.modules?.results) {
      allModules.push(...pageData.modules.results);
    }
    if (pageData.submodules?.results) {
      allSubmodules.push(...pageData.submodules.results);
    }
    if (pageData.functionalities?.results) {
      allFunctionalities.push(...pageData.functionalities.results);
    }
  });

  

  // 6. Deduplicate merged arrays by their canonical id fields.
  // The API returns objects with both an internal `id` and a domain id
  // field (module/submodule/functionality). Use the domain id when
  // available, otherwise fall back to the generic `id`.
  const dedupeBy = (arr: any[], keySelector: (item: any) => any) => {
    const seen = new Set<any>();
    const out: any[] = [];
    for (const item of arr) {
      const key = keySelector(item);
      if (key === undefined || key === null) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  };

  const uniqueModules = dedupeBy(allModules, (x) => x.module ?? x.id);
  const uniqueSubmodules = dedupeBy(allSubmodules, (x) => x.submodule ?? x.id);
  const uniqueFunctionalities = dedupeBy(
    allFunctionalities,
    (x) => x.functionality ?? x.id
  );

  // 7. Return the final, combined data structure with updated counts/pages
  return {
    modules: {
      ...modules,
      results: uniqueModules,
      count: uniqueModules.length,
      total_pages: 1,
    },
    submodules: {
      ...submodules,
      results: uniqueSubmodules,
      count: uniqueSubmodules.length,
      total_pages: 1,
    },
    functionalities: {
      ...functionalities,
      results: uniqueFunctionalities,
      count: uniqueFunctionalities.length,
      total_pages: 1,
    },
  };
};

import { useEffect, useState } from "react";

export const usePrivileges = () => {
  // keep a client-side state for the current role so we can react when
  // setTokens() dispatches an 'auth:changed' event or storage changes.
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(() =>
    getRoleId()
  );

  useEffect(() => {
    const onAuthChanged = () => {
      setCurrentRoleId(getRoleId());
    };

    // Listen to explicit auth changes triggered by setTokens/clearTokens
    window.addEventListener("auth:changed", onAuthChanged);

    // Also listen for storage events (in case another tab changed auth)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "role" || e.key === "access" || e.key === "refresh") {
        setCurrentRoleId(getRoleId());
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("auth:changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return useQuery({
    queryKey: ["privileges", currentRoleId],
    // Use the new comprehensive fetch function
    queryFn: async () => {
      if (currentRoleId === null || currentRoleId === undefined)
        throw new Error("No role found in storage");
      // fetchAllPrivileges expects a string role id (it builds URLs). Convert here.
      return fetchAllPrivileges(String(currentRoleId));
    },
    // Standard react-query options
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // 1 minute
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!currentRoleId,
  });
};
