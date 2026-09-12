"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { NavLink } from "@/types";

export type ToastTone = "success" | "info" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: NavLink;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id" | "tone"> & { tone?: ToastTone; duration?: number }) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ duration = 4500, tone = "success", ...rest }) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, tone, ...rest }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
