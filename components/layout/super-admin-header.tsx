"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearTokens, loadTokens } from "@/lib/api/auth";
import { ModeToggle } from "../ui/ModeToggle";
import { usePrivileges } from "@/hooks/usePrivilegesLoad";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGrabToScroll } from "@/hooks/useGrabToScroll";
import { useHoverCapability } from "@/hooks/useHoverCapability";

export function SuperAdminHeader() {
  const router = useRouter();
  const { data, isLoading } = usePrivileges();
  const [roleName, setRoleName] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const grabScrollProps = useGrabToScroll(navRef);
  const isHoverCapable = useHoverCapability();

  // State and handlers for HOVER devices
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = (moduleName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredCategory(moduleName);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHoveredCategory(null), 200);
  };

  // Scroll fade logic
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  useEffect(() => {
    const navElement = navRef.current;
    const checkScroll = () => {
      if (navElement) {
        const { scrollLeft, scrollWidth, clientWidth } = navElement;
        setShowLeftFade(scrollLeft > 1);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    if (navElement) navElement.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      if (navElement) navElement.removeEventListener("scroll", checkScroll);
    };
  }, [data, isLoading]);

  useEffect(() => {
    loadTokens();
    const storedRole = localStorage.getItem("role_name");
    if (storedRole) setRoleName(storedRole);
    else router.push("/login");
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  if (isLoading) return <div>Loading...</div>;

  const allModules = data?.modules?.results || [];
  const permittedSubmodules = data?.submodules?.results || [];
  const functionalities = data?.functionalities?.results || [];
  const activeModuleNames = new Set(permittedSubmodules.map(sub => sub.module_name));

  // --- REUSABLE COMPONENT FOR DROPDOWN CONTENT ---
  // This avoids code duplication and ensures content is always present.
  const MenuContent = ({ module }: { module: typeof allModules[0] }) => (
    <>
      {permittedSubmodules
        .filter((sub) => sub.module_name === module.module_name)
        .map((sub) => (
          <div key={sub.id} className="space-y-1">
            <Link
              href={`/${module.module_name.toLowerCase()}/${sub.submodule_name.toLowerCase()}`}
              className="font-semibold hover:text-primary block"
            >
              {sub.submodule_name}
            </Link>
            <ul className="pl-2 space-y-1">
              {functionalities
                .filter((fn) => fn.submodule_name === sub.submodule_name)
                .map((fn) => (
                  <li key={fn.id}>
                    <Link
                      href={`/${module.module_name.toLowerCase()}/${sub.submodule_name.toLowerCase()}/${fn.functionality_name.toLowerCase()}`}
                      className="hover:text-primary text-sm block"
                    >
                      {fn.functionality_name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border dark:bg-slate-950 bg-white">
      {/* Top Bar - No Changes */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/admin" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div className="leading-tight">
            <span className="text-xl font-bold text-primary">MediCare</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" /> Admin Portal
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="flex items-center gap-2"><User className="w-4 h-4" /> <span className="hidden md:inline">{roleName ?? "Loading..."}</span></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end"><DropdownMenuItem onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Second Navbar (Mega Menu) */}
      <div className="border-t border-border">
        <div className={`scroll-fade-container ${showLeftFade ? "show-left-fade" : ""} ${showRightFade ? "show-right-fade" : ""}`}>
          <nav ref={navRef} {...grabScrollProps} className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto hide-scrollbar grabbable">
            {allModules.map((mod) => {
              const hasSubmodules = activeModuleNames.has(mod.module_name);

              if (!hasSubmodules) {
                return <Button key={mod.id} variant="ghost" disabled className="text-sm font-medium shrink-0 opacity-75 cursor-default">{mod.module_name}</Button>;
              }

              return isHoverCapable ? (
                // --- DESKTOP: HOVER-ENABLED POPOVER ---
                <div key={mod.id} onMouseEnter={() => handleMouseEnter(mod.module_name)} onMouseLeave={handleMouseLeave}>
                  <Popover open={hoveredCategory === mod.module_name} onOpenChange={(open) => !open && setHoveredCategory(null)}>
                    <PopoverTrigger asChild><Button variant="ghost" className="flex items-center gap-1 text-sm font-medium shrink-0">{mod.module_name}<ChevronDown className="w-3 h-3" /></Button></PopoverTrigger>
                    <PopoverContent className="w-[500px] p-6 grid grid-cols-2 gap-4">
                      <MenuContent module={mod} />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                // --- MOBILE: CLICK-ENABLED POPOVER ---
                <Popover key={mod.id}>
                  <PopoverTrigger asChild><Button variant="ghost" className="flex items-center gap-1 text-sm font-medium shrink-0">{mod.module_name}<ChevronDown className="w-3 h-3" /></Button></PopoverTrigger>
                  <PopoverContent className="w-screen max-w-sm p-6 grid grid-cols-2 gap-4">
                    <MenuContent module={mod} />
                  </PopoverContent>
                </Popover>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}