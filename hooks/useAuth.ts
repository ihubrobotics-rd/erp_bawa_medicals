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

  // --- 💡 FIX 1: Initialize all state from the cache ---
  // We run this logic once on mount to get the user from the RQ cache.
  const [initialUser, setInitialUser] = useState<UserLike | null>(
    () => (queryClient.getQueryData(["user"]) as UserLike) ?? null
  );

  const [user, setUser] = useState<UserLike | null>(initialUser);


  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(!!initialUser);


  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);
  
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    // This function hydrates state on a cold page load (e.g., F5 refresh)
    const hydrateFromLocalStorage = () => {
      // If we already have a user (from React Query cache), we're hydrated.
      // We just need to ensure the state is correct.
      if (initialUser) {
        setUser(initialUser);
        setIsLoading(false);
        setIsAuthenticated(true);
        return;
      }

      // No cached user, so check localStorage
      loadTokens();
      const token = getAccessToken();

      if (token) {
        // Build a minimal user object from stored role metadata
        const minimal = {
          role: getRoleId(),
          role_name: getRoleName(),
          name: getRoleName(),
          permissions: [],
        };
        setUser(minimal);
        setIsAuthenticated(true);
      }

      // Whether we found a token or not, we're done checking.
      setIsLoading(false);
    };

    hydrateFromLocalStorage();

   
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

    // initialUser is stable from useState, queryClient is stable
  }, [queryClient, initialUser]);

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
      setIsLoading(false); // We are definitely not loading anymore

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