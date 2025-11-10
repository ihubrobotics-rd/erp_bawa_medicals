"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/* --------------------------
   Submodule Button Component
----------------------------- */
const SubmoduleMenuItem = ({
  sub,
  isOpen,
  onToggle,
  buttonRef,
}: {
  sub: any;
  isOpen: boolean;
  onToggle: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const hasFunctionalities = !!(sub.functionalities && sub.functionalities.length);

  if (!hasFunctionalities) {
    // ✅ Simple submodule link (no flyout)
    return (
      <Link
        href={`/manage/${sub.submoduleId}`}
        className="flex items-center justify-between w-full rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
      >
        {sub.name}
      </Link>
    );
  }

  // ✅ Submodule with functionalities (flyout trigger)
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex items-center justify-between w-full rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
        isOpen ? "bg-slate-100 dark:bg-slate-800" : ""
      )}
      aria-expanded={isOpen}
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
  );
};

/* --------------------------
   Flyout Functionalities Portal
----------------------------- */
const FlyoutPortal = ({
  anchorRect,
  items,
  open,
  onClose,
  id,
}: {
  anchorRect: DOMRect | null;
  items: any[];
  open: boolean;
  onClose: () => void;
  id: string | number;
}) => {
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<{ left: number; top: number; transformOrigin?: string } | null>(
    null
  );

  useLayoutEffect(() => {
    if (!open || !anchorRect) {
      setStyle(null);
      return;
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const gap = 8;
    const anchorRight = anchorRect.right + scrollX;
    const anchorLeft = anchorRect.left + scrollX;
    const anchorTop = anchorRect.top + scrollY;
    const flyoutW = 220;
    const flyoutH = Math.min(300, items.length * 40);

    let left = anchorRight + gap;
    let transformOrigin = "left top";

    if (left + flyoutW > viewportW + scrollX - 8) {
      left = anchorLeft - flyoutW - gap;
      transformOrigin = "right top";
    }

    let top = anchorTop;
    const margin = 8;
    const maxTop = viewportH + scrollY - flyoutH - margin;
    const minTop = scrollY + margin;
    if (top > maxTop) top = maxTop;
    if (top < minTop) top = minTop;

    setStyle({ left, top, transformOrigin });
  }, [open, anchorRect, items.length]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const el = flyoutRef.current;
      if (el && !el.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={`flyout-${id}`}
        ref={flyoutRef}
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 6 }}
        transition={{ duration: 0.18 }}
        style={{
          position: "absolute",
          left: style?.left ?? 0,
          top: style?.top ?? 0,
          zIndex: 9999,
          transformOrigin: style?.transformOrigin,
        }}
        className="w-56 bg-background border shadow-lg rounded-md py-1"
      >
        {items.map((func: any, idx: number) => (
          <Link
            key={`func-${id}-${func.functionalityId}-${idx}`}
            href={`/manage/functionality/${func.functionalityId}`}
            className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            {func.name}
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

/* --------------------------
   Main MenuContent Component
----------------------------- */
export const MenuContent = ({ module }: { module: any }) => {
  const [openSubId, setOpenSubId] = useState<number | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleToggle = (sub: any) => {
    const id = sub.submoduleId;
    const hasFunctionalities = !!(sub.functionalities && sub.functionalities.length);

    if (!hasFunctionalities) return; // skip flyout for simple links

    if (openSubId === id) {
      setOpenSubId(null);
      setAnchorRect(null);
      return;
    }

    const btn = buttonRefs.current[id];
    if (btn) setAnchorRect(btn.getBoundingClientRect());
    else setAnchorRect(null);

    setOpenSubId(id);
  };

  useEffect(() => {
    const closeFlyout = () => {
      setOpenSubId(null);
      setAnchorRect(null);
    };
    window.addEventListener("resize", closeFlyout);
    window.addEventListener("scroll", closeFlyout, true);
    return () => {
      window.removeEventListener("resize", closeFlyout);
      window.removeEventListener("scroll", closeFlyout, true);
    };
  }, []);

  const currentSub =
    module.submodules.find((s: any) => s.submoduleId === openSubId) ?? null;
  const currentFuncs = currentSub?.functionalities ?? [];

  return (
    <div className="relative flex flex-col space-y-1">
      {module.submodules.map((sub: any) => {
        const isOpen = openSubId === sub.submoduleId;
        return (
          <div key={`sub-${sub.submoduleId}`} className="relative">
            <SubmoduleMenuItem
              sub={sub}
              isOpen={isOpen}
              onToggle={() => handleToggle(sub)}
              buttonRef={(el: HTMLButtonElement) => {
              buttonRefs.current[sub.submoduleId] = el;
              }}
            />
          </div>
        );
      })}

      {/* Flyout for functionalities */}
      <FlyoutPortal
        id={openSubId ?? "none"}
        anchorRect={anchorRect}
        items={currentFuncs}
        open={!!currentFuncs.length && openSubId !== null}
        onClose={() => {
          setOpenSubId(null);
          setAnchorRect(null);
        }}
      />
    </div>
  );
};
