"use client";

import { useId, useRef } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** "top" pins the panel near the top of the viewport (search palette style). */
  position?: "center" | "top";
  /** Render children without the default header (the title stays as the accessible name). */
  bare?: boolean;
  className?: string;
}

const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

/** Accessible modal dialog. Unmounted while closed, so its form state resets each time it opens. */
export function Modal(props: ModalProps) {
  if (!props.open) return null;
  return <ModalPanel {...props} />;
}

function ModalPanel({ onClose, title, description, children, size = "md", position = "center", bare, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useBodyScrollLock(true);
  useDialogFocus(panelRef, onClose);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex justify-center overflow-y-auto p-4",
        position === "top" ? "items-start pt-[8vh]" : "items-center"
      )}
    >
      <div aria-hidden className="fixed inset-0 animate-fade-in bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative w-full animate-pop-in rounded-xl bg-white shadow-2xl outline-none",
          widths[size],
          className
        )}
      >
        {bare ? (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        ) : (
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div>
              <h2 id={titleId} className="font-display text-xl font-semibold text-ink">
                {title}
              </h2>
              {description && <div className="mt-1 text-sm text-muted">{description}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-2 -mt-1 grid size-9 place-items-center rounded-md text-subtle transition hover:bg-cream hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
