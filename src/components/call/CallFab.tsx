"use client";

import { Phone } from "lucide-react";
import { useUI } from "@/context/UIContext";

/**
 * Floating "Call us" button, always visible in the bottom-right corner —
 * replaces the old Eva chat bubble now that every order goes by phone.
 */
export function CallFab() {
  const { requestCall, callOpen } = useUI();

  if (callOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <button
        type="button"
        onClick={() => requestCall()}
        aria-label="Call to order"
        className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(249,115,22,0.7)] transition hover:bg-brand-dark"
      >
        <Phone aria-hidden className="size-4" />
        Call us
      </button>
    </div>
  );
}
