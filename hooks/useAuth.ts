"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api, {
  setTokens,
  clearTokens,
  loadTokens,
  getAccessToken,
  getRoleId,
  getRoleName,
} from "@/lib/api/auth";
import { useEffect, useState } from "react";

type UserLike = any;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<UserLike | null>(
    () => queryClient.getQueryData(["user"]) ?? null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize client-only tokens + hydrate minimal user info.
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    // load tokens into in-memory module state
    loadTokens();

    const cached = queryClient.getQueryData(["user"]);
    if (cached) {
      setUser(cached as UserLike);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // If there's an access token but no cached user, build a minimal user
    // object from stored role metadata so role-based UI can render before a
    // full fetch completes.
    const token = getAccessToken();
    if (token) {
      const minimal = {
        role: getRoleId(),
        role_name: getRoleName(),
        name: getRoleName(),
        permissions: [],
      };
      setUser(minimal);
      setIsAuthenticated(true);
    }

    setIsLoading(false);

    // Listen for manual auth changes (setTokens dispatches an `auth:changed` event)
    const onAuthChanged = () => {
      const u = queryClient.getQueryData(["user"]) ?? null;
      setUser(u as UserLike | null);
      setIsAuthenticated(!!u);
    };

    window.addEventListener("auth:changed", onAuthChanged as EventListener);
    return () =>
      window.removeEventListener(
        "auth:changed",
        onAuthChanged as EventListener
      );
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
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

      // Cache user in react-query
      queryClient.setQueryData(["user"], data.data.user);

      return data.data.user;
    },
    onSuccess: (u) => {
      // update local state + ensure privileges refetch
      setUser(u as UserLike);
      setIsAuthenticated(true);

      const roleId = u?.role ?? null;
      if (roleId !== null && roleId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["privileges", roleId] });
        queryClient.refetchQueries({ queryKey: ["privileges", roleId] });
      }

      toast.success(`Welcome back, ${u.username || "User"}!`, {
        description: "You are now logged in.",
      });
    },
    onError: (err: any) => {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      toast.error("Login Failed", {
        description:
          err?.response?.data?.message ||
          "Please check your username and password.",
      });
    },
  });

  const logout = () => {
    clearTokens();
    queryClient.removeQueries({ queryKey: ["user"] });
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Logged Out", {
      description: "You have been successfully logged out.",
    });
  };

  const hasPermission = (permission: string) => {
    return (
      !!user &&
      Array.isArray(user.permissions) &&
      user.permissions.includes(permission)
    );
  };

  const hasRole = (role: number | string | Array<number | string>) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role) || roles.includes(user.role_name);
  };

  return {
    user,
    login: (username: string, password: string) =>
      loginMutation.mutateAsync({ username, password }),
    logout,
    isLoading: isLoading || loginMutation.status === "pending",
    isAuthenticated,
    hasPermission,
    hasRole,
  };
};
