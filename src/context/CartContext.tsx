"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/data/mockData";
import { getProduct } from "@/lib/catalog";
import { createLocalStore } from "@/lib/localStore";
import type { CartLine, Product } from "@/types";

const MAX_QTY = 99;

function parseLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (l): l is CartLine =>
        typeof l === "object" && l !== null && typeof l.productId === "string" && typeof l.quantity === "number"
    )
    .filter((l) => getProduct(l.productId))
    .map((l) => ({ productId: l.productId, quantity: Math.min(MAX_QTY, Math.max(1, Math.round(l.quantity))) }));
}

const EMPTY: CartLine[] = [];
const cartStore = createLocalStore<CartLine[]>(siteConfig.cartStorageKey, EMPTY, parseLines);

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  /** Product most recently added — used to highlight its line in the drawer. */
  lastAddedId: string | null;
  addItem: (product: Product | string, quantity?: number, options?: { openDrawer?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const { closeOverlay } = useUI();

  // The drawer is the instant-add feedback, so it takes over from search / menu / sign-in overlays.
  const showDrawer = useCallback(() => {
    closeOverlay();
    setIsOpen(true);
  }, [closeOverlay]);

  const items = useMemo<CartItem[]>(
    () =>
      lines.flatMap((line) => {
        const product = getProduct(line.productId);
        return product ? [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }] : [];
      }),
    [lines]
  );

  const addItem = useCallback<CartContextValue["addItem"]>((product, quantity = 1, options = {}) => {
    const id = typeof product === "string" ? product : product.id;
    if (!getProduct(id)) return;
    const qty = Math.max(1, Math.round(quantity));
    cartStore.set((prev) => {
      const existing = prev.find((l) => l.productId === id);
      if (existing) {
        return prev.map((l) => (l.productId === id ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) } : l));
      }
      return [...prev, { productId: id, quantity: Math.min(MAX_QTY, qty) }];
    });
    setLastAddedId(id);
    if (options.openDrawer ?? true) showDrawer();
  }, [showDrawer]);

  const removeItem = useCallback((productId: string) => {
    cartStore.set((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      cartStore.set((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    cartStore.set((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(MAX_QTY, Math.round(quantity)) } : l))
    );
  }, []);

  const clearCart = useCallback(() => cartStore.set(EMPTY), []);
  const openCart = showDrawer;
  const closeCart = useCallback(() => setIsOpen(false), []);
  const getQuantity = useCallback(
    (productId: string) => lines.find((l) => l.productId === productId)?.quantity ?? 0,
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
      isOpen,
      lastAddedId,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      getQuantity,
    }),
    [items, isOpen, lastAddedId, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, getQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
