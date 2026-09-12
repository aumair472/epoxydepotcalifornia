"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { UIProvider } from "@/context/UIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UIProvider>
        <CartProvider>{children}</CartProvider>
      </UIProvider>
    </ToastProvider>
  );
}
