// New components/SuperAdminHeader.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Shield, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // <-- IMPORT COLLAPSIBLE
import { clearTokens, loadTokens, navigateToRoleOrLogin } from "@/lib/api/auth";
import { ModeToggle } from "../ui/ModeToggle";
import { usePrivilegeContext } from "@/providers/PrivilegeProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGrabToScroll } from "@/hooks/useGrabToScroll";
import { useHoverCapability } from "@/hooks/useHoverCapability";
import { cn } from "@/lib/utils"; // <-- Make sure you have this utility

// ... (NavSkeleton component remains the same) ...
const NavSkeleton = () => (
    <nav className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto hide-scrollbar">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="h-9 w-24 bg-muted animate-pulse rounded-full shrink-0"
        />
      ))}
    </nav>
  );


// --- NEW SUB-COMPONENT to handle nested logic ---
const SubmoduleMenuItem = ({ sub }: { sub: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Case 1: Submodule has functionalities -> render a collapsible dropdown
  if (sub.functionalities && sub.functionalities.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
            <span>{sub.name}</span>
            <ChevronRight
              className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pt-1 space-y-1">
          {sub.functionalities.map((func: any) => (
            <Link
              // --- THIS IS THE FIX ---
              // Use func.id (the unique record ID) instead of func.functionalityId
              key={func.id} 
              // The href is still correct, as it needs to link to the functionality page
              href={`/manage/functionality/${func.functionalityId}`}
              className="block rounded-md p-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            >
              {func.name}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Case 2: Submodule has NO functionalities -> render a simple link
  return (
       <Link
      key={sub.submoduleId}
      href={`/manage/${sub.submoduleId}`}
      className="block rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
    >
      {sub.name}
    </Link>
  );
};


// --- UPDATED MenuContent to use the new component ---
const MenuContent = ({ module }: { module: any }) => (
  <div className="flex flex-col space-y-1">
    {module.submodules.map((sub: any) => (
      <SubmoduleMenuItem key={sub.submoduleId} sub={sub} />
    ))}
  </div>
);


export function SuperAdminHeader() {
  // ... (all your existing hooks and state: router, navigationTree, roleName, etc.)
  // NO CHANGES needed in the main component logic, only in the JSX returned by it.
  // The rest of your SuperAdminHeader component can remain exactly the same.
  // The only change is that `MenuContent` now handles the nesting.
  const router = useRouter();
  const { navigationTree, isLoading } = usePrivilegeContext();
  const [roleName, setRoleName] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const grabScrollProps = useGrabToScroll(navRef);
  const isHoverCapable = useHoverCapability();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const handleMouseEnter = (moduleName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredCategory(moduleName);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHoveredCategory(null), 200);
  };
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;
    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = navElement;
      setShowLeftFade(scrollLeft > 1);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
    };
    checkScroll();
    navElement.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      navElement.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [navigationTree, isLoading]);
  useEffect(() => {
    loadTokens();
    const storedRole = localStorage.getItem("role_name");
    if (storedRole) setRoleName(storedRole);
    else {
      navigateToRoleOrLogin(router);
    }
  }, [router]);
  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    // ... your existing JSX for the header ...
    // The part rendering the links/popovers is what matters.
    // I've copied the full return statement for clarity.
    <header className="sticky top-0 z-50 w-full border-b border-border dark:bg-slate-950 bg-white">
      {/* Top Bar (no changes) */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">
                  {roleName ?? (
                    <span className="w-16 h-4 bg-muted animate-pulse rounded inline-block" />
                  )}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Second Navbar (Mega Menu) */}
      <div className="border-t border-border">
        {!hasMounted || isLoading ? (
          <NavSkeleton />
        ) : (
          <div
            className={`scroll-fade-container ${
              showLeftFade ? "show-left-fade" : ""
            } ${showRightFade ? "show-right-fade" : ""}`}
          >
            <nav
              ref={navRef}
              {...grabScrollProps}
              className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto hide-scrollbar grabbable"
            >
              {navigationTree &&
                Array.from(navigationTree.values()).map((m) => {
                  const module: any = m as any;
                  if (module.type === "link") {
                    return (
                      <Link
                        key={module.name}
                        href={`/${module.name
                          .toLowerCase()
                          .replace(/[\s/]+/g, "-")}`}
                      >
                        <Button
                          variant="ghost"
                          className="text-sm font-medium shrink-0 hover:text-orange-600"
                        >
                          {module.name}
                        </Button>
                      </Link>
                    );
                  }

                  if (module.type === "dropdown") {
                    return isHoverCapable ? (
                      <div
                        key={module.name}
                        onMouseEnter={() => handleMouseEnter(module.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Popover
                          open={hoveredCategory === module.name}
                          onOpenChange={(open) =>
                            !open && setHoveredCategory(null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-1 text-sm font-medium shrink-0"
                            >
                              {module.name}
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-64 p-2 max-h-[75vh] overflow-y-auto"
                            align="start"
                          >
                            <MenuContent module={module} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <Popover key={module.name}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-sm font-medium shrink-0"
                          >
                            {module.name}
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-64 p-2 max-h-[75vh] overflow-y-auto"
                          align="start"
                        >
                          <MenuContent module={module} />
                        </PopoverContent>
                      </Popover>
                    );
                  }
                  return null;
                })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}