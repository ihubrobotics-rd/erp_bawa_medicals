// lib/api/auth.ts
"use client";

import axios from "axios";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let roleId: number | null = null;
let roleName: string | null = null;
let isActive: boolean | null = null;

// lib/api/auth.ts
export const setTokens = (
  access: string,
  refresh: string,
  user?: {
    role?: number;
    role_name?: string;
    is_active?: boolean;
  }
) => {
  accessToken = access;
  refreshToken = refresh;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  if (user?.role !== undefined)
    localStorage.setItem("role", user.role.toString());
  if (user?.role_name) localStorage.setItem("role_name", user.role_name);
  if (user?.is_active !== undefined)
    localStorage.setItem("is_active", String(user.is_active));
  // update in-memory copies immediately
  syncUserIntoMemory(user);
  // notify the app that auth state changed so listeners (e.g. privilege loader)
  // can re-read role/localStorage and re-run queries.
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("auth:changed"));
    } catch (e) {
      // some environments may restrict Event constructor; fallback to CustomEvent
      window.dispatchEvent(new CustomEvent("auth:changed"));
    }
  }
};

// Keep module-level variables in sync so getters that read the in-memory
// values immediately after setTokens() will see the updated data without
// needing a round-trip to localStorage.
// (This prevents a race where code reads getRoleId() immediately after
// login before the next render.)
const syncUserIntoMemory = (user?: {
  role?: number;
  role_name?: string;
  is_active?: boolean;
}) => {
  if (!user) return;
  if (user.role !== undefined) roleId = user.role;
  if (user.role_name !== undefined) roleName = user.role_name;
  if (user.is_active !== undefined) isActive = user.is_active;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  roleId = null;
  roleName = null;
  isActive = null;

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("role_name");
  localStorage.removeItem("is_active");
};

export const loadTokens = () => {
  if (typeof window === "undefined") return; // noop on server

  accessToken = localStorage.getItem("access");
  refreshToken = localStorage.getItem("refresh");
  roleId = localStorage.getItem("role")
    ? Number(localStorage.getItem("role"))
    : null;
  roleName = localStorage.getItem("role_name");
  isActive = localStorage.getItem("is_active") === "true";
};

// Note: do NOT call loadTokens() at module evaluation time. Call it from
// client entry points (for example inside a useEffect in hooks/useAuth.ts)
// so we don't access localStorage during SSR.

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Refresh handling
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!refreshToken) {
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = data.access;
        // Pass the original refresh token to setTokens
        setTokens(newAccess, refreshToken); 
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper getters for other parts of the app
export const getAccessToken = () =>
  accessToken ??
  (typeof window !== "undefined" ? localStorage.getItem("access") : null);
export const getRefreshToken = () =>
  refreshToken ??
  (typeof window !== "undefined" ? localStorage.getItem("refresh") : null);
export const getRoleId = () =>
  roleId ??
  (typeof window !== "undefined" && localStorage.getItem("role")
    ? Number(localStorage.getItem("role"))
    : null);
export const getRoleName = () =>
  roleName ??
  (typeof window !== "undefined" ? localStorage.getItem("role_name") : null);
export const getIsActive = () =>
  isActive ??
  (typeof window !== "undefined" &&
    localStorage.getItem("is_active") === "true");

// Basic JWT expiry check (assumes JWT structure). Returns true if token expired or invalid.
export const isTokenExpired = (token?: string | null) => {
  const t = token ?? getAccessToken();
  if (!t) return true;
  try {
    // atob is only available in browser. Guard for server.
    const b64 =
      typeof window !== "undefined" && typeof atob === "function"
        ? atob(t.split(".")[1])
        : Buffer.from(t.split(".")[1], "base64").toString("utf-8");
    const payload = JSON.parse(b64);
    if (!payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch (e) {
    return true;
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token available");

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
    { refresh }
  );

  const newAccess = data.access ?? data.data?.access;
  const newRefresh = data.refresh ?? refresh; // Use new refresh token if provided
  setTokens(newAccess, newRefresh);

  return newAccess;
};

// ==================================================================
// ✅ NEW CENTRALIZED NAVIGATION FUNCTION
// This is now the single source of truth for role-based routing.
// ==================================================================
export const navigateToRoleOrLogin = async (
  // Use 'replace' to prevent users from clicking "back" to the login page
  router: { replace: (p: string) => void } | any
) => {
  // Use replace if available, otherwise fall back to push
  const nav = router.replace ?? router.push;

  try {
    const token = getAccessToken();

    if (!token) {
      nav("/login");
      return;
    }

    if (isTokenExpired(token)) {
      try {
        await refreshAccessToken();
      } catch (e) {
        // can't refresh -> go login
        clearTokens(); // Make sure old bad tokens are gone
        nav("/login");
        return;
      }
    }

    // Reload tokens from localStorage *after* potential refresh
    loadTokens(); 
    const raw = getRoleName();
    
    if (!raw) {
      nav("/login");
      return;
    }

    // This is the robust logic to handle "Super Admin", "super-admin", etc.
    const r = String(raw).toLowerCase().trim().replace(/[\s_-]/g, "");

    // --- THIS IS THE MOST IMPORTANT PART FOR DEBUGGING ---
    console.log("--- VERCEL ROLE DEBUG ---");
    console.log("Raw role from getRoleName():", raw);
    console.log("Normalized role for check:", r);
    console.log("--- END VERCEL ROLE DEBUG ---");

    if (r.includes("super")) {
      nav("/superadmin");
    } else if (r.includes("admin")) {
      nav("/admin");
    } else {
      nav("/dashboard");
    }
  } catch (e) {
    console.error("Navigation failed:", e);
    nav("/login");
  }
};