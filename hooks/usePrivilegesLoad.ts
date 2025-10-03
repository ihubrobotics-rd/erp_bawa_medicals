// hooks/usePrivileges.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api, { getRoleId } from "@/lib/api/auth";

export const usePrivileges = () => {
  const roleId = getRoleId();

  return useQuery({
    queryKey: ["privileges", roleId],
    queryFn: async () => {
      if (!roleId) throw new Error("No role found in storage");

      const { data } = await api.get(`/Privilege/role/privileges/${roleId}/`);
      return data.data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    enabled: !!roleId,
  });
};
