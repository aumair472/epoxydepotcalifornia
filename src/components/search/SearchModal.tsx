"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, FileText, Search, X } from "lucide-react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { useUI } from "@/context/UIContext";
import { categories, popularSearches } from "@/data/mockData";
import { getCategoryName, getDocHref, searchCatalog } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function SearchModal() {
  const { searchOpen, closeOverlay, searchSeed } = useUI();
  return (
    <Modal open={searchOpen} onClose={closeOverlay} title="Search the catalog" size="lg" position="top" bare className="overflow-hidden">
      <SearchPanel seed={searchSeed} onClose={closeOverlay} />
    </Modal>
  );
}

interface Option {
  key: string;
  href: string;
  external?: boolean;
}

function SearchPanel({ seed, onClose }: { seed: string; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState(seed);
  const [active, setActive] = useState(-1);
  const results = useMemo(() => searchCatalog(query, { products: 6, categories: 3, docs: 4 }), [query]);
  const trimmed = query.trim();
  const allHref = `/shop?q=${encodeURIComponent(trimmed)}`;

  const options: Option[] = [
    ...results.products.map((p) => ({ key: `p-${p.id}`, href: `/product/${p.id}` })),
    ...results.categories.map((c) => ({ key: `c-${c.slug}`, href: `/shop/${c.slug}` })),
    ...results.docs.map((d) => ({ key: `d-${d.id}`, href: getDocHref(d), external: true })),
    ...(trimmed ? [{ key: "all", href: allHref }] : []),
  ];
  const indexOf = (key: string) => options.findIndex((o) => o.key === key);

  const go = (option: Option) => {
    onClose();
    if (option.external) window.open(option.href, "_blank", "noopener");
    else router.push(option.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && options[active]) go(options[active]);
      else if (trimmed) go({ key: "all", href: allHref });
    }
  };

  const activeKey = options[active]?.key;
  const rowClass = (key: string) =>
    cn("flex items-center gap-3 rounded-lg px-3 py-2.5 transition", activeKey === key ? "bg-brand/10" : "hover:bg-cream");

  return (
    <div className="flex max-h-[80vh] flex-col">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <Search aria-hidden className="size-5 shrink-0 text-brand" />
        <input
          data-autofocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search epoxy, flake, primers, tools, SDS…"
          aria-label="Search products, categories and documents"
          aria-activedescendant={activeKey ? `search-opt-${activeKey}` : undefined}
          aria-controls="search-results"
          role="combobox"
          aria-expanded={options.length > 0}
          className="h-11 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-subtle/70"
        />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">ESC</kbd>
        <button type="button" onClick={onClose} aria-label="Close search" className="grid size-9 place-items-center rounded-md text-subtle hover:bg-cream hover:text-ink">
          <X className="size-5" />
        </button>
      </div>

      <div id="search-results" role="listbox" aria-label="Search results" className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        {!trimmed ? (
          <div className="space-y-6 p-2">
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink transition hover:border-brand hover:text-brand"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Shop by category</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-[13px] font-medium text-ink transition hover:border-brand hover:text-brand"
                  >
                    <Icon name={c.icon} className="size-4 text-brand" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : results.total === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="font-display text-lg font-semibold">No matches for “{trimmed}”</p>
            <p className="mt-1 text-sm text-muted">Try a product type like “primer” or “flake”, or ask our tech reps.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 5).map((term) => (
                <button key={term} type="button" onClick={() => setQuery(term)} className="rounded-full border border-line px-3 py-1.5 text-[13px] hover:border-brand hover:text-brand">
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {results.products.length > 0 && (
              <section>
                <p className="eyebrow mb-2 px-3">Products</p>
                <ul>
                  {results.products.map((p) => {
                    const key = `p-${p.id}`;
                    return (
                      <li key={key} id={`search-opt-${key}`} role="option" aria-selected={activeKey === key} className={rowClass(key)} onMouseEnter={() => setActive(indexOf(key))}>
                        <Link href={`/product/${p.id}`} onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
                          <span className="size-12 shrink-0 rounded-md border border-line bg-gradient-to-b from-cream-2 to-white p-1">
                            <ProductImage product={p} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                            <span className="block truncate text-xs text-subtle">
                              {getCategoryName(p.category)} · {p.packSize} · {formatPrice(p.price)}
                            </span>
                          </span>
                        </Link>
                        <CallToOrderButton productId={p.id} size="xs" />
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
            {results.categories.length > 0 && (
              <section>
                <p className="eyebrow mb-2 px-3">Categories</p>
                <ul>
                  {results.categories.map((c) => {
                    const key = `c-${c.slug}`;
                    return (
                      <li key={key} id={`search-opt-${key}`} role="option" aria-selected={activeKey === key} onMouseEnter={() => setActive(indexOf(key))}>
                        <Link href={`/shop/${c.slug}`} onClick={onClose} className={rowClass(key)}>
                          <span className="grid size-9 place-items-center rounded-md bg-charcoal text-gold">
                            <Icon name={c.icon} className="size-4" />
                          </span>
                          <span className="text-sm font-medium text-ink">{c.name}</span>
                          <span className="ml-auto truncate text-xs text-subtle">{c.description}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
            {results.docs.length > 0 && (
              <section>
                <p className="eyebrow mb-2 px-3">Documents</p>
                <ul>
                  {results.docs.map((d) => {
                    const key = `d-${d.id}`;
                    return (
                      <li key={key} id={`search-opt-${key}`} role="option" aria-selected={activeKey === key} onMouseEnter={() => setActive(indexOf(key))}>
                        <a href={getDocHref(d)} target="_blank" rel="noopener" onClick={onClose} className={rowClass(key)}>
                          <FileText aria-hidden className="size-4 shrink-0 text-brand" />
                          <span className="truncate text-sm text-ink">{d.title}</span>
                          <span className="ml-auto shrink-0 rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-subtle">{d.type}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>

      {trimmed && results.total > 0 && (
        <div className="border-t border-line bg-cream/60 px-4 py-3">
          <Link
            id="search-opt-all"
            href={allHref}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-ink",
              activeKey === "all" && "bg-brand/10"
            )}
          >
            <span>
              See all product results for “{trimmed}”
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.14em] text-brand uppercase">
              Enter <ArrowRight aria-hidden className="size-3.5" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
