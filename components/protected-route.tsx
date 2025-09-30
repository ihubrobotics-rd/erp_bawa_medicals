"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api, {
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
  getRoleId,
  getRoleName,
} from "@/lib/api/auth";

type Props = {
  children: ReactNode;
  allowedRoles?: Array<number | string>; // optional list of allowed role ids or role names
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const ensureAuth = async () => {
      try {
        const token = getAccessToken();

        // If no token at all -> go login (replace history so original protected URL isn't kept)
        if (!token) {
          if (mounted) router.replace("/login");
          return;
        }

        // If token expired try refresh
        if (isTokenExpired(token)) {
          try {
            await refreshAccessToken();
          } catch (e) {
            // can't refresh -> clear and go to login
            if (mounted) router.replace("/login");
            return;
          }
        }

        // Optionally verify role
        if (allowedRoles && allowedRoles.length > 0) {
          const roleId = getRoleId();
          const roleName = getRoleName();

          const matches = allowedRoles.some((r) => {
            if (typeof r === "number") return roleId === r;
            return roleName === String(r);
          });

          if (!matches) {
            if (mounted) router.replace("/login");
            return;
          }
        }

        // All good
        if (mounted) setReady(true);
      } catch (err) {
        if (mounted) router.push("/login");
      }
    };

    ensureAuth();

    return () => {
      mounted = false;
    };
  }, [router, allowedRoles]);

  if (!ready) return null;
  return <>{children}</>;
}
