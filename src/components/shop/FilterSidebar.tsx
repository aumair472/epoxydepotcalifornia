"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { ShopParams } from "@/components/shop/useShopParams";
import { categories, packGroups, priceBuckets } from "@/data/mockData";
import type { getFacetCounts } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { CategorySlug } from "@/types";

interface FilterSidebarProps {
  category?: CategorySlug;
  params: ShopParams;
  /** Current query string, carried over when switching category. */
  query: string;
  facets: ReturnType<typeof getFacetCounts>;
  onChange: (patch: Partial<ShopParams>) => void;
  onClear: () => void;
  onNavigate?: () => void;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.18em] text-subtle uppercase">{children}</h2>;
}

export function FilterSidebar({ category, params, query, facets, onChange, onClear, onNavigate }: FilterSidebarProps) {
  const rowClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13.5px] transition",
      active ? "bg-brand/15 font-semibold text-brand-deep" : "text-ink hover:bg-white"
    );
  const hasFilters = params.min !== undefined || params.max !== undefined || params.packs.length > 0 || params.q || params.tag;

  return (
    <div className="space-y-8">
      <section>
        <Heading>Category</Heading>
        <ul className="space-y-0.5">
          <li>
            <Link href={`/shop${query}`} onClick={onNavigate} className={rowClass(!category)} aria-current={!category ? "page" : undefined}>
              All categories
              <span className="ml-auto text-xs text-subtle tabular-nums">{facets.allCategories}</span>
            </Link>
          </li>
          {categories.map((c) => {
            const active = category === c.slug;
            const count = facets.byCategory.get(c.slug) ?? 0;
            return (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}${query}`}
                  onClick={onNavigate}
                  className={cn(rowClass(active), !active && count === 0 && "opacity-50")}
                  aria-current={active ? "page" : undefined}
                >
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                  <span className="ml-auto text-xs text-subtle tabular-nums">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <Heading>Price</Heading>
        <div role="radiogroup" aria-label="Price range" className="space-y-0.5">
          {priceBuckets.map((b) => {
            const active = params.min === b.min && params.max === b.max;
            return (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(active ? { min: undefined, max: undefined } : { min: b.min, max: b.max })}
                className={rowClass(active)}
              >
                <span
                  aria-hidden
                  className={cn("grid size-4 place-items-center rounded-full border", active ? "border-brand bg-brand" : "border-subtle/40 bg-white")}
                >
                  {active && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                {b.label}
              </button>
            );
          })}
        </div>
        <PriceRange key={`${params.min ?? ""}-${params.max ?? ""}`} min={params.min} max={params.max} onApply={(min, max) => onChange({ min, max })} />
      </section>

      <section>
        <Heading>Pack size</Heading>
        <ul className="space-y-0.5">
          {packGroups.map((g) => {
            const checked = params.packs.includes(g.id);
            const count = facets.byPack.get(g.id) ?? 0;
            return (
              <li key={g.id}>
                <label className={cn(rowClass(false), "cursor-pointer", !checked && count === 0 && "cursor-not-allowed opacity-45")}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={!checked && count === 0}
                    onChange={() => onChange({ packs: checked ? params.packs.filter((p) => p !== g.id) : [...params.packs, g.id] })}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-4 place-items-center rounded border peer-focus-visible:ring-2 peer-focus-visible:ring-brand",
                      checked ? "border-brand bg-brand text-white" : "border-subtle/40 bg-white"
                    )}
                  >
                    {checked && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {g.label}
                  <span className="ml-auto text-xs text-subtle tabular-nums">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {hasFilters && (
        <button type="button" onClick={onClear} className="text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
          Clear all filters
        </button>
      )}
    </div>
  );
}

/** Custom min/max inputs. Keyed by the active range so it resets when the URL changes. */
function PriceRange({ min, max, onApply }: { min?: number; max?: number; onApply: (min?: number, max?: number) => void }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parse = (v: FormDataEntryValue | null) => {
      const s = String(v ?? "").trim();
      const n = Number(s);
      return s === "" || !Number.isFinite(n) || n < 0 ? undefined : n;
    };
    let lo = parse(data.get("min"));
    let hi = parse(data.get("max"));
    if (lo !== undefined && hi !== undefined && lo > hi) [lo, hi] = [hi, lo];
    onApply(lo, hi);
  };
  const inputClass =
    "h-9 w-full rounded-md border border-line bg-white pr-2 pl-6 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
  return (
    <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2" aria-label="Custom price range">
      <div className="relative flex-1">
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-subtle">$</span>
        <input name="min" inputMode="numeric" defaultValue={min ?? ""} placeholder="Min" aria-label="Minimum price" className={inputClass} />
      </div>
      <span aria-hidden className="text-subtle">–</span>
      <div className="relative flex-1">
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-subtle">$</span>
        <input name="max" inputMode="numeric" defaultValue={max ?? ""} placeholder="Max" aria-label="Maximum price" className={inputClass} />
      </div>
      <button type="submit" className="h-9 rounded-md bg-charcoal px-3 text-[10px] font-bold tracking-[0.12em] text-white uppercase hover:bg-charcoal-2">
        Go
      </button>
    </form>
  );
}
