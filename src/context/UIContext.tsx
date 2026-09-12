"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/localStore";

export interface MockUser {
  name: string;
  email: string;
}

function parseUser(raw: unknown): MockUser | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { name, email } = raw as Record<string, unknown>;
  return typeof name === "string" && typeof email === "string" ? { name, email } : null;
}

const userStore = createLocalStore<MockUser | null>("edc-user-v1", null, parseUser);

type Overlay = "search" | "signIn" | "mobileMenu" | null;

interface UIContextValue {
  searchOpen: boolean;
  signInOpen: boolean;
  mobileMenuOpen: boolean;
  chatOpen: boolean;
  /** Query to prefill when the search overlay opens. */
  searchSeed: string;
  openSearch: (seed?: string) => void;
  openSignIn: () => void;
  openMobileMenu: () => void;
  closeOverlay: () => void;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  user: MockUser | null;
  signIn: (user: MockUser) => void;
  signOut: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/** Global overlay state. Only one of search / sign-in / mobile menu is open at a time; chat is independent. */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [searchSeed, setSearchSeed] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const user = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot, userStore.getServerSnapshot);

  const openSearch = useCallback((seed = "") => {
    setSearchSeed(seed);
    setOverlay("search");
  }, []);
  const openSignIn = useCallback(() => setOverlay("signIn"), []);
  const openMobileMenu = useCallback(() => setOverlay("mobileMenu"), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openChat = useCallback(() => {
    setOverlay(null);
    setChatOpen(true);
  }, []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen((open) => !open), []);
  const signIn = useCallback((u: MockUser) => userStore.set(u), []);
  const signOut = useCallback(() => userStore.set(null), []);

  const value = useMemo<UIContextValue>(
    () => ({
      searchOpen: overlay === "search",
      signInOpen: overlay === "signIn",
      mobileMenuOpen: overlay === "mobileMenu",
      chatOpen,
      searchSeed,
      openSearch,
      openSignIn,
      openMobileMenu,
      closeOverlay,
      openChat,
      closeChat,
      toggleChat,
      user,
      signIn,
      signOut,
    }),
    [overlay, chatOpen, searchSeed, openSearch, openSignIn, openMobileMenu, closeOverlay, openChat, closeChat, toggleChat, user, signIn, signOut]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
