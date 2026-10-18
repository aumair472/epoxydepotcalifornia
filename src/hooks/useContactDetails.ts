"use client";

import { useSyncExternalStore } from "react";
import { decodeContact, type ContactDetails } from "@/lib/contact";

let cached: ContactDetails | undefined;
const getSnapshot = () => (cached ??= decodeContact());
const getServerSnapshot = () => null;
const subscribe = () => () => {};

/**
 * The store's phone and email, decoded in the browser only. Server HTML gets `null`, so the
 * number never appears in what bots and scrapers download; real visitors see it after hydration.
 */
export function useContactDetails(): ContactDetails | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
