"use client";

import { ToastProvider } from "@/context/ToastContext";
import { UIProvider } from "@/context/UIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UIProvider>{children}</UIProvider>
    </ToastProvider>
  );
}
