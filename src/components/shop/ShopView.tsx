"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { useShopParams } from "@/components/shop/useShopParams";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Field";
import { packGroups } from "@/data/mockData";
import { filterProducts, getCategory, getFacetCounts, getTagLabel, isSortKey, sortOptions, sortProducts } from "@/lib/catalog";
import { formatPrice, pluralize } from "@/lib/format";
import type { CategorySlug } from "@/types";

export function ShopView({ category }: { category?: CategorySlug }) {
  const { params, filters, update, clear, query } = useShopParams(category);
  const [sheetOpen, setSheetOpen] = useState(false);
  const results = useMemo(() => sortProducts(filterProducts(filters), params.sort), [filters, params.sort]);
  const facets = useMemo(() => getFacetCounts(filters), [filters]);
  const cat = category ? getCategory(category) : undefined;

  const title = cat?.name ?? (params.tag ? getTagLabel(params.tag) : params.q ? `Results for “${params.q}”` : "All Products");

  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (params.q) chips.push({ key: "q", label: `“${params.q}”`, remove: () => update({ q: undefined }) });
  if (params.tag) chips.push({ key: "tag", label: getTagLabel(params.tag), remove: () => update({ tag: undefined }) });
  if (params.min !== undefined || params.max !== undefined) {
    const label =
      params.min !== undefined && params.max !== undefined
        ? `${formatPrice(params.min)} – ${formatPrice(params.max)}`
        : params.min !== undefined
          ? `${formatPrice(params.min)} +`
          : `Up to ${formatPrice(params.max!)}`;
    chips.push({ key: "price", label, remove: () => update({ min: undefined, max: undefined }) });
  }
  for (const p of params.packs) {
    chips.push({
      key: `pack-${p}`,
      label: packGroups.find((g) => g.id === p)?.label ?? p,
      remove: () => update({ packs: params.packs.filter((x) => x !== p) }),
    });
  }

  const sidebar = (onNavigate?: () => void) => (
    <FilterSidebar category={category} params={params} query={query} facets={facets} onChange={update} onClear={clear} onNavigate={onNavigate} />
  );

  return (
    <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs items={cat ? [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: cat.name }] : [{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Shop</p>
          <h1 className="mt-2 font-display text-[34px] leading-tight font-bold text-ink md:text-[40px]">{title}</h1>
          {cat && <p className="mt-2 text-[15px] leading-relaxed text-muted">{cat.longDescription}</p>}
          <p className="mt-2 text-sm text-subtle" aria-live="polite">
            {pluralize(results.length, "product")} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setSheetOpen(true)}>
            <SlidersHorizontal aria-hidden className="size-3.5" /> Filters{chips.length > 0 && ` (${chips.length})`}
          </Button>
          <label htmlFor="shop-sort" className="sr-only">
            Sort products
          </label>
          <Select
            id="shop-sort"
            value={params.sort}
            onChange={(e) => isSortKey(e.target.value) && update({ sort: e.target.value })}
            className="h-9 w-[190px] text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[232px_1fr] lg:gap-10">
        <aside aria-label="Product filters" className="hidden lg:block">
          {sidebar()}
        </aside>

        <div className="min-w-0">
          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.remove}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1 pr-2 pl-3 text-xs font-medium text-ink transition hover:border-brand"
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label}
                  <X aria-hidden className="size-3.5 text-subtle" />
                </button>
              ))}
              <button type="button" onClick={clear} className="ml-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
                Clear all
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <ProductGrid products={results} columns={3} />
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <PackageSearch aria-hidden className="mx-auto size-10 text-subtle" strokeWidth={1.4} />
              <h2 className="mt-4 font-display text-xl font-semibold">No products match these filters</h2>
              <p className="mt-1 text-sm text-muted">Try widening the price range or clearing a pack size.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={clear}>Clear filters</Button>
                <ButtonLink href="/contact" variant="outline">
                  Ask a tech rep
                </ButtonLink>
              </div>
            </div>
          )}

          {cat && results.length > 0 && (
            <p className="mt-10 text-center text-sm text-muted">
              Need help choosing? <Link href="/resources#library" className="font-semibold text-brand-deep hover:underline">Browse data sheets</Link> or call us.
            </p>
          )}
        </div>
      </div>

      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} label="Filters" side="bottom">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close filters" className="grid size-9 place-items-center rounded-md hover:bg-cream">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto bg-cream/60 px-4 py-5">{sidebar(() => setSheetOpen(false))}</div>
        <div className="border-t border-line bg-white p-4">
          <Button block size="md" onClick={() => setSheetOpen(false)}>
            Show {pluralize(results.length, "product")}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
