// providers/PrivilegeProvider.tsx
"use client";

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRoleId } from '@/lib/api/auth';
import apiClient from '@/lib/api';

const PrivilegeContext = createContext(null);

export const PrivilegeProvider = ({ children }: { children: React.ReactNode }) => {
  const roleId = getRoleId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['privileges', roleId],
    queryFn: async () => {
      if (!roleId) return null; // Don't fetch if no roleId
      const response = await apiClient.get(`/Privilege/role/privileges/${roleId}/`);
      return response.data.data; // Return the nested 'data' object
    },
    enabled: !!roleId, // Only run the query if roleId exists
    staleTime: 1000 * 60 * 5, // Cache privileges for 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <PrivilegeContext.Provider value={{ privileges: data, isLoading, isError }}>
      {children}
    </PrivilegeContext.Provider>
  );
};

// hooks/usePrivileges.ts
export const usePrivileges = () => {
    const context = useContext(PrivilegeContext);
    if (!context) {
        throw new Error('usePrivileges must be used within a PrivilegeProvider');
    }
    return context;
};