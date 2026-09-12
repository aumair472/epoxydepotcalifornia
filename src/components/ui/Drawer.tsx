"use client";

import { useRef } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { cn } from "@/lib/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  side?: "right" | "left" | "bottom";
  children: React.ReactNode;
  className?: string;
}

const panelBySide = {
  right: { base: "right-0 top-0 h-full w-full max-w-[420px]", closed: "translate-x-full" },
  left: { base: "left-0 top-0 h-full w-full max-w-[360px]", closed: "-translate-x-full" },
  bottom: { base: "inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl", closed: "translate-y-full" },
};

/**
 * Slide-over panel. Stays mounted so it can animate both ways; while closed it is
 * `inert` and invisible (visibility flips after the exit transition finishes).
 */
export function Drawer({ open, onClose, label, side = "right", children, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);
  useDialogFocus(panelRef, onClose, open);
  const s = panelBySide[side];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[65]",
        // Visible immediately on open (so focus can move in); hidden only after the exit slide.
        open ? "visible" : "pointer-events-none invisible transition-[visibility] duration-300"
      )}
      inert={!open}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/45 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-out",
          s.base,
          open ? "translate-x-0 translate-y-0" : s.closed,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
