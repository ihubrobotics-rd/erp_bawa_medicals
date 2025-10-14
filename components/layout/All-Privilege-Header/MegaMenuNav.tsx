"use client";

import { useEffect, useState, useRef } from "react";
import { NavItem } from "./NavItem";
import { useGrabToScroll } from "@/hooks/useGrabToScroll";
import { useHoverCapability } from "@/hooks/useHoverCapability";

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

interface MegaMenuNavProps {
  navigationTree: Map<string, any> | undefined;
  isLoading: boolean;
}

export const MegaMenuNav = ({ navigationTree, isLoading }: MegaMenuNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const grabScrollProps = useGrabToScroll(navRef);
  const isHoverCapable = useHoverCapability();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => setHasMounted(true), []);

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

  const handleMouseEnter = (moduleName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredCategory(moduleName);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHoveredCategory(null), 200);
  };

  if (!hasMounted || isLoading) {
    return <NavSkeleton />;
  }

  return (
    <div
      className={`scroll-fade-container ${showLeftFade ? "show-left-fade" : ""} ${showRightFade ? "show-right-fade" : ""}`}
    >
      <nav
        ref={navRef}
        {...grabScrollProps}
        className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto hide-scrollbar grabbable"
      >
        {navigationTree &&
          Array.from(navigationTree.values()).map((module: any) => (
            <NavItem
              key={module.name}
              module={module}
              isHoverCapable={isHoverCapable}
              hoveredCategory={hoveredCategory}
              onMouseEnter={() => handleMouseEnter(module.name)}
              onMouseLeave={handleMouseLeave}
              onOpenChange={(open) => !open && setHoveredCategory(null)}
            />
          ))}
      </nav>
    </div>
  );
};