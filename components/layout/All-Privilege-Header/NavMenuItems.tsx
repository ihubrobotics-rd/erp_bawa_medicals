"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Your excellent, unchanged SubmoduleMenuItem component
export const SubmoduleMenuItem = ({ sub }: { sub: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

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
            <CollapsibleContent className="pl-4 pt-1 space-y-1">
              {sub.functionalities.map((func: any, index: number) => (
                <motion.div
                  key={`func-${sub.submoduleId}-${func.functionalityId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/manage/functionality/${func.functionalityId}`}
                    className="block rounded-md p-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
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

  return (
    <Link
      href={`/manage/${sub.submoduleId}`}
      className="block rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
    >
      {sub.name}
    </Link>
  );
};

// Your unchanged MenuContent component
export const MenuContent = ({ module }: { module: any }) => (
  <div className="flex flex-col space-y-1">
    {module.submodules.map((sub: any) => (
      <SubmoduleMenuItem key={`sub-${sub.submoduleId}`} sub={sub} />
    ))}
  </div>
);