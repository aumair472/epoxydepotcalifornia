"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Download, FileText, FlaskConical, Palette, Search, ShieldAlert, X } from "lucide-react";
import { Select } from "@/components/ui/Field";
import { categories, resourceDocs } from "@/data/mockData";
import { getCategoryName, getDocHref } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatDate, formatFileSize, pluralize } from "@/lib/format";
import type { CategorySlug, DocType } from "@/types";

const TYPES: ("All" | DocType)[] = ["All", "TDS", "SDS", "Color Chart", "Mix Guide", "How-To"];

const typeIcons: Record<DocType, typeof FileText> = {
  TDS: FileText,
  SDS: ShieldAlert,
  "Color Chart": Palette,
  "Mix Guide": FlaskConical,
  "How-To": BookOpen,
};

const PAGE = 12;

/** Searchable, filterable list of every TDS / SDS / chart / guide PDF. */
export function DocumentLibrary() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | DocType>("All");
  const [category, setCategory] = useState<"all" | CategorySlug>("all");
  const [limit, setLimit] = useState(PAGE);

  const byQueryAndCategory = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return resourceDocs.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      const hay = `${d.title} ${d.description} ${d.type} ${d.category ?? ""}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [query, category]);
  const results = type === "All" ? byQueryAndCategory : byQueryAndCategory.filter((d) => d.type === type);
  const countFor = (t: "All" | DocType) => (t === "All" ? byQueryAndCategory.length : byQueryAndCategory.filter((d) => d.type === t).length);

  const reset = () => {
    setQuery("");
    setType("All");
    setCategory("all");
    setLimit(PAGE);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Search by product, SKU or document type…"
            aria-label="Search documents"
            className="h-12 w-full rounded-md border border-line bg-white pr-4 pl-10 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
          />
        </div>
        <label htmlFor="doc-category" className="sr-only">
          Filter by category
        </label>
        <Select
          id="doc-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as "all" | CategorySlug);
            setLimit(PAGE);
          }}
          className="h-12 md:w-56"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div role="group" aria-label="Document type" className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => {
              setType(t);
              setLimit(PAGE);
            }}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
              type === t ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-ink hover:border-ink"
            )}
          >
            {t === "All" ? "All documents" : t}
            <span className={cn("text-xs tabular-nums", type === t ? "text-white/60" : "text-subtle")}>{countFor(t)}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-subtle" aria-live="polite">
        {pluralize(results.length, "document")}
      </p>

      {results.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold">No documents match</p>
          <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
            <X aria-hidden className="size-3.5" /> Reset filters
          </button>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {results.slice(0, limit).map((d) => {
            const TypeIcon = typeIcons[d.type];
            return (
              <li key={d.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand/10 text-brand-deep">
                    <TypeIcon aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink">{d.title}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {d.category ? `${getCategoryName(d.category)} · ` : ""}
                      {d.pages} {d.pages === 1 ? "page" : "pages"} · {formatFileSize(d.sizeKb)} · Rev. {formatDate(d.updated)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <span className="rounded bg-cream px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">{d.type}</span>
                  {d.productId && (
                    <Link href={`/product/${d.productId}`} className="px-2 text-xs font-medium text-muted hover:text-brand">
                      View product
                    </Link>
                  )}
                  <a
                    href={getDocHref(d)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-3.5 text-[11px] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-brand-dark"
                  >
                    <Download aria-hidden className="size-3.5" /> PDF
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {results.length > limit && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="inline-flex h-11 items-center rounded-md border-2 border-ink px-6 text-[11px] font-bold tracking-[0.14em] uppercase transition hover:bg-ink hover:text-white"
          >
            Show more ({results.length - limit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
