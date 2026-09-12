"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { useToast, type ToastTone } from "@/context/ToastContext";
import { cn } from "@/lib/cn";

const toneStyles: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CircleCheck, className: "text-emerald-600" },
  info: { icon: Info, className: "text-brand" },
  error: { icon: CircleAlert, className: "text-danger" },
};

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-stretch gap-2 sm:right-auto sm:left-6 sm:w-[380px]"
    >
      {toasts.map((t) => {
        const { icon: ToneIcon, className } = toneStyles[t.tone];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex animate-slide-up items-start gap-3 rounded-lg border border-line bg-white p-4 shadow-[0_12px_32px_-12px_rgba(24,24,27,0.35)]"
          >
            <ToneIcon aria-hidden className={cn("mt-0.5 size-5 shrink-0", className)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] leading-snug text-muted">{t.description}</p>}
              {t.action && (
                <Link
                  href={t.action.href}
                  onClick={() => dismiss(t.id)}
                  className="mt-2 inline-block text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark"
                >
                  {t.action.label} →
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="grid size-7 place-items-center rounded text-subtle hover:bg-cream hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
