"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // ✅ Import sonner toast
import api, { setTokens, clearTokens } from "@/lib/api/auth";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      console.log("LOGIN PAYLOAD:", { username, password });

      const { data } = await api.post("/accounts/login/", {
        username,
        password,
      });

      // Store tokens + role data
      setTokens(data.data.access, data.data.refresh, {
        role: data.data.user.role,
        role_name: data.data.user.role_name,
        is_active: data.data.user.is_active,
      });

      // Cache user
      queryClient.setQueryData(["user"], data.data.user);

      return data.data.user;
    },
    onSuccess: (user) => {
      // Make sure any components depending on privileges refetch immediately
      // after login. We use the same query key shape as usePrivileges (role id)
      // to invalidate and refetch.
      const roleId = user?.role ?? null;
      if (roleId !== null && roleId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["privileges", roleId] });
        queryClient.refetchQueries({ queryKey: ["privileges", roleId] });
      }

      toast.success(`Welcome back, ${user.username || "User"}!`, {
        description: "You are now logged in.",
      });
    },
    onError: (err: any) => {
      clearTokens();
      toast.error("Login Failed", {
        description:
          err?.response?.data?.message ||
          "Please check your username and password.",
      });
    },
  });

  const logout = () => {
    clearTokens();
    // remove user query by key
    queryClient.removeQueries({ queryKey: ["user"] });
    toast.info("Logged Out", {
      description: "You have been successfully logged out.",
    });
  };

  return {
    login: (username: string, password: string) =>
      loginMutation.mutateAsync({ username, password }),
    logout,
    // expose a consistent isLoading boolean (react-query v5 mutation uses status)
    isLoading: loginMutation.status === "pending",
  };
};
