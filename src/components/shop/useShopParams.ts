"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { isPackGroupId, isProductTag, isSortKey, type ProductFilters, type SortKey } from "@/lib/catalog";
import type { CategorySlug, PackGroupId, ProductTag } from "@/types";

export interface ShopParams {
  q?: string;
  tag?: ProductTag;
  min?: number;
  max?: number;
  packs: PackGroupId[];
  sort: SortKey;
}

function parseNumber(value: string | null) {
  if (value === null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function paramsToQuery(p: ShopParams) {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.tag) sp.set("tag", p.tag);
  if (p.min !== undefined) sp.set("min", String(p.min));
  if (p.max !== undefined) sp.set("max", String(p.max));
  if (p.packs.length) sp.set("pack", p.packs.join(","));
  if (p.sort !== "featured") sp.set("sort", p.sort);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// The query string as an external store. Not useSearchParams: that would make Next render the
// whole shop in the browser only, so the product grid (the LCP on Google Ads landing pages) would
// wait for JavaScript. Here the server renders the unfiltered grid and any URL filters apply
// right after hydration.
const URL_CHANGE = "shop:urlchange";
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE, onChange);
  };
}
const getSearch = () => window.location.search;
const getServerSearch = () => "";

function replaceUrl(url: string) {
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(URL_CHANGE));
}

/**
 * Shop filter state lives in the URL. Updates go through the native History API — instant
 * filtering with shareable URLs and no refetch.
 */
export function useShopParams(category?: CategorySlug) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const pathname = usePathname();

  const params = useMemo<ShopParams>(() => {
    const searchParams = new URLSearchParams(search);
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") ?? "featured";
    return {
      q: searchParams.get("q")?.trim() || undefined,
      tag: tag && isProductTag(tag) ? tag : undefined,
      min: parseNumber(searchParams.get("min")),
      max: parseNumber(searchParams.get("max")),
      packs: (searchParams.get("pack") ?? "").split(",").filter(isPackGroupId),
      sort: isSortKey(sort) ? sort : "featured",
    };
  }, [search]);

  const filters = useMemo<ProductFilters>(
    () => ({ category, q: params.q, tag: params.tag, min: params.min, max: params.max, packs: params.packs }),
    [category, params]
  );

  const update = useCallback(
    (patch: Partial<ShopParams>) => {
      const next = { ...params, ...patch };
      replaceUrl(`${pathname}${paramsToQuery(next)}`);
    },
    [params, pathname]
  );

  const clear = useCallback(() => {
    replaceUrl(pathname);
  }, [pathname]);

  return { params, filters, update, clear, query: paramsToQuery(params) };
}
