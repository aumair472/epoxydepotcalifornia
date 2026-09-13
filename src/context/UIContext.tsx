"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { siteConfig } from "@/data/mockData";
import type { CallSubject } from "@/types";

type Overlay = "search" | "call" | "mobileMenu" | null;

interface UIContextValue {
  searchOpen: boolean;
  callOpen: boolean;
  mobileMenuOpen: boolean;
  /** Query to prefill when the search overlay opens. */
  searchSeed: string;
  /** What the open call dialog is about (product, class…). */
  callSubject: CallSubject | null;
  openSearch: (seed?: string) => void;
  /**
   * Every buy action on the site. Touch devices go straight to the phone dialer;
   * desktops get the "Call to order" dialog with the number and what to mention.
   */
  requestCall: (subject?: CallSubject) => void;
  openMobileMenu: () => void;
  closeOverlay: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/** Global overlay state. Only one of search / call / mobile menu is open at a time. */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [searchSeed, setSearchSeed] = useState("");
  const [callSubject, setCallSubject] = useState<CallSubject | null>(null);

  const openSearch = useCallback((seed = "") => {
    setSearchSeed(seed);
    setOverlay("search");
  }, []);
  const requestCall = useCallback((subject?: CallSubject) => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      window.location.href = siteConfig.phoneHref;
      return;
    }
    setCallSubject(subject ?? null);
    setOverlay("call");
  }, []);
  const openMobileMenu = useCallback(() => setOverlay("mobileMenu"), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const value = useMemo<UIContextValue>(
    () => ({
      searchOpen: overlay === "search",
      callOpen: overlay === "call",
      mobileMenuOpen: overlay === "mobileMenu",
      searchSeed,
      callSubject,
      openSearch,
      requestCall,
      openMobileMenu,
      closeOverlay,
    }),
    [overlay, searchSeed, callSubject, openSearch, requestCall, openMobileMenu, closeOverlay]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
