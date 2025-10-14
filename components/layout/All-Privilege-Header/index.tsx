"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivilegeContext } from "@/providers/PrivilegeProvider";
import { clearTokens, loadTokens, navigateToRoleOrLogin } from "@/lib/api/auth";
import { HeaderTopBar } from "./HeaderTopBar";
import { MegaMenuNav } from "./MegaMenuNav";

export function SuperAdminHeader() {
  const router = useRouter();
  const { navigationTree, isLoading } = usePrivilegeContext();
  const [roleName, setRoleName] = useState<string | null>(null);

  // Effect for authentication and role loading
  useEffect(() => {
    loadTokens();
    const storedRole = localStorage.getItem("role_name");
    if (storedRole) {
      setRoleName(storedRole);
    } else {
      navigateToRoleOrLogin(router);
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border dark:bg-slate-950 bg-white">
      {/* Top Bar */}
      <HeaderTopBar roleName={roleName} onLogout={handleLogout} />

      {/* Second Navbar (Mega Menu) */}
      <div className="border-t border-border">
        <MegaMenuNav navigationTree={navigationTree} isLoading={isLoading} />
      </div>
    </header>
  );
}