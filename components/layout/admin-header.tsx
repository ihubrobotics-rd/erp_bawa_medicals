"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearTokens, loadTokens, navigateToRoleOrLogin } from "@/lib/api/auth";
import { ModeToggle } from "../ui/ModeToggle";

export function AdminHeader() {
  const router = useRouter();
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    // Load tokens into memory and let centralized helper decide where to go.
    loadTokens();
    const storedRole = localStorage.getItem("role_name");
    if (storedRole) setRoleName(storedRole);
    else {
      // If there's no stored role, attempt to navigate based on tokens (which
      // may trigger a refresh). This prevents flashing a login redirect when a
      // valid token is present but role_name hasn't been synced into localStorage yet.
      navigateToRoleOrLogin(router);
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className=" border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <span className="text-xl font-bold text-primary">MediCare</span>
              <span className="text-sm text-muted-foreground ml-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="text-sm font-medium hover:text-primary"
            >
              Users
            </Link>
            <Link
              href="/admin/medicines"
              className="text-sm font-medium hover:text-primary"
            >
              Medicines
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm font-medium hover:text-primary"
            >
              Orders
            </Link>
            <Link
              href="/admin/reports"
              className="text-sm font-medium hover:text-primary"
            >
              Reports
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {roleName ?? "Loading..."}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem >
                 
                  Theme
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
