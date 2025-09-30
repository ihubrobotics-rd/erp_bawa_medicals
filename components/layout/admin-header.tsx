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
import { clearTokens, loadTokens } from "@/lib/api/auth";

export function AdminHeader() {
  const router = useRouter();
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    loadTokens(); // loads tokens into memory
    const storedRole = localStorage.getItem("role_name");
    if (storedRole) {
      setRoleName(storedRole);
    } else {
      // if no user data, redirect to login
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
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
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium hover:text-primary">
              Users
            </Link>
            <Link href="/admin/medicines" className="text-sm font-medium hover:text-primary">
              Medicines
            </Link>
            <Link href="/admin/orders" className="text-sm font-medium hover:text-primary">
              Orders
            </Link>
            <Link href="/admin/reports" className="text-sm font-medium hover:text-primary">
              Reports
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                5
              </Badge>
            </Button>

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
                <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
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
