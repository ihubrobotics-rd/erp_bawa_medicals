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
  // 1. Fetch the first page to get initial data and pagination info
  const initialResponse = await api.get(`/Privilege/role/privileges/${roleId}/`);
  const firstPageData = initialResponse.data.data;

  if (!firstPageData) {
    // Return a default structure if the API response is empty
    return { modules: { results: [] }, submodules: { results: [] }, functionalities: { results: [] } };
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
    pagePromises.push(api.get(`/Privilege/role/privileges/${roleId}/?page=${page}`));
  }

  // 4. Fetch all other pages concurrently
  const additionalPageResponses = await Promise.all(pagePromises);

  // 5. Aggregate the results from all pages
  const allModules = [...(modules?.results || [])];
  const allSubmodules = [...(submodules?.results || [])];
  const allFunctionalities = [...(functionalities?.results || [])];

  additionalPageResponses.forEach(response => {
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

  // 6. Return the final, combined data structure
  // We update count and set total_pages to 1 as we've merged everything.
  return {
    modules: { ...modules, results: allModules, count: allModules.length, total_pages: 1 },
    submodules: { ...submodules, results: allSubmodules, count: allSubmodules.length, total_pages: 1 },
    functionalities: { ...functionalities, results: allFunctionalities, count: allFunctionalities.length, total_pages: 1 },
  };
};

export const usePrivileges = () => {
  const roleId = getRoleId();

  return useQuery({
    queryKey: ["privileges", roleId],
    // Use the new comprehensive fetch function
    queryFn: async () => {
      if (!roleId) throw new Error("No role found in storage");
      return fetchAllPrivileges(roleId);
    },
    // Standard react-query options
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    enabled: !!roleId, // Query will only run if roleId exists
  });
};