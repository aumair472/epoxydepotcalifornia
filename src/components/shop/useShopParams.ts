"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
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

/**
 * Shop filter state lives in the URL. Updates go through the native History API, which
 * Next.js syncs with useSearchParams — instant filtering with shareable URLs and no refetch.
 */
export function useShopParams(category?: CategorySlug) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = useMemo<ShopParams>(() => {
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
  }, [searchParams]);

  const filters = useMemo<ProductFilters>(
    () => ({ category, q: params.q, tag: params.tag, min: params.min, max: params.max, packs: params.packs }),
    [category, params]
  );

  const update = useCallback(
    (patch: Partial<ShopParams>) => {
      const next = { ...params, ...patch };
      window.history.replaceState(null, "", `${pathname}${paramsToQuery(next)}`);
    },
    [params, pathname]
  );

  const clear = useCallback(() => {
    window.history.replaceState(null, "", pathname);
  }, [pathname]);

  return { params, filters, update, clear, query: paramsToQuery(params) };
}
