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
} from "@/components/ui/collapsible";
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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
// NavSkeleton stays unchanged
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
// SubmoduleMenuItem with animated arrow, active highlighting, and keyboard accessibility
const SubmoduleMenuItem = ({ sub }: { sub: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLButtonElement>(null);

  // Keyboard support for opening/closing collapsible
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  // Collapsible with accessible, animated chevron and highlight on open
  if (sub.functionalities && sub.functionalities.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            ref={itemRef}
            type="button"
            className={cn(
              "flex items-center justify-between w-full rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
              isOpen ? "bg-slate-100 dark:bg-slate-800" : ""
            )}
            aria-expanded={isOpen}
            aria-controls={`func-list-${sub.submoduleId}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <span>{sub.name}</span>
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight
                className="h-4 w-4"
                color={isOpen ? "orange" : undefined}
                aria-hidden="true"
              />
            </motion.span>
          </button>
        </CollapsibleTrigger>
        <AnimatePresence initial={false}>
          {isOpen && (
            <CollapsibleContent
              id={`func-list-${sub.submoduleId}`}
              className="pl-4 pt-1 space-y-1"
            >
              {sub.functionalities.map((func: any, index: number) => (
                <motion.div
                  key={`func-${sub.submoduleId}-${func.id}-${func.functionalityId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/manage/functionality/${func.functionalityId}`}
                    className="block rounded-md p-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    tabIndex={0}
                    aria-label={func.name}
                  >
                    {func.name}
                  </Link>
                </motion.div>
              ))}
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    );
  }
  // Simple link for submodules with no functionalities
  return (
    <Link
      key={`sub-${sub.submoduleId}`}
      href={`/manage/${sub.submoduleId}`}
      className="block rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
      tabIndex={0}
      aria-label={sub.name}
    >
      {sub.name}
    </Link>
  );
};
// MenuContent: remains same, just calls SubmoduleMenuItem
const MenuContent = ({ module }: { module: any }) => (
  <div className="flex flex-col space-y-1">
    {module.submodules.map((sub: any) => (
      <SubmoduleMenuItem key={`sub-${sub.submoduleId}`} sub={sub} />
    ))}
  </div>
);

export function SuperAdminHeader() {
  const router = useRouter();
  const { navigationTree, isLoading } = usePrivilegeContext();
  const [roleName, setRoleName] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const grabScrollProps = useGrabToScroll(navRef);
  const isHoverCapable = useHoverCapability();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
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
  const handleMouseEnter = (moduleName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredCategory(moduleName);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHoveredCategory(null), 200);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border dark:bg-slate-950 bg-white">
      {/* Top Bar */}
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
                              aria-label={module.name}
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
                            aria-label={module.name}
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
