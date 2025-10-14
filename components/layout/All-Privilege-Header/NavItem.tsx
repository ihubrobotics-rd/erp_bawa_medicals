"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MenuContent } from "./NavMenuItems";

interface NavItemProps {
  module: any;
  isHoverCapable: boolean;
  hoveredCategory: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOpenChange: (open: boolean) => void;
}

export const NavItem = ({
  module,
  isHoverCapable,
  hoveredCategory,
  onMouseEnter,
  onMouseLeave,
  onOpenChange,
}: NavItemProps) => {

  if (module.type === "link") {
    const href = `/${module.name.toLowerCase().replace(/[\s/]+/g, "-")}`;
    return (
      <Link href={href}>
        <Button variant="ghost" className="text-sm font-medium shrink-0 hover:text-orange-600">
          {module.name}
        </Button>
      </Link>
    );
  }

  if (module.type === "dropdown") {
    const popoverProps = isHoverCapable
      ? {
          open: hoveredCategory === module.name,
          onOpenChange: onOpenChange,
        }
      : {};

    const containerProps = isHoverCapable
      ? {
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
        }
      : {};

    return (
      <div {...containerProps}>
        <Popover {...popoverProps}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-sm font-medium shrink-0"
            >
              {module.name}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 max-h-[75vh] overflow-y-auto" align="start">
            <MenuContent module={module} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return null;
};