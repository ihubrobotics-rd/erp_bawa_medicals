"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { UserMenu } from "./UserMenu";

interface HeaderTopBarProps {
  roleName: string | null;
  onLogout: () => void;
}

export const HeaderTopBar = ({ roleName, onLogout }: HeaderTopBarProps) => {
  return (
    <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <div className="leading-tight">
          <span className="text-xl font-bold text-primary">Bawa Medicals</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />Super Admin Portal
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserMenu roleName={roleName} onLogout={onLogout} />
      </div>
    </div>
  );
};