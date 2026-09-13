"use client";

import { useRef, useState } from "react";
import { Check, Download, FileText, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useUI } from "@/context/UIContext";
import { getDocHref } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatDate, formatFileSize } from "@/lib/format";
import type { Product, ResourceDoc, Review, Spec } from "@/types";

type TabId = "overview" | "specs" | "application" | "documents" | "reviews";

interface ProductTabsProps {
  product: Product;
  specs: Spec[];
  docs: ResourceDoc[];
  reviews: Review[];
}

export function ProductTabs({ product, specs, docs, reviews }: ProductTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    ...(product.application ? [{ id: "application" as const, label: "Application & mix" }] : []),
    { id: "documents", label: `Documents (${docs.length})` },
    { id: "reviews", label: `Reviews (${product.reviewCount})` },
  ];
  const [active, setActive] = useState<TabId>("overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="details" className="mt-16 scroll-mt-56">
      <div role="tablist" aria-label="Product details" className="scrollbar-none flex gap-7 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "-mb-px border-b-2 py-3.5 text-[11.5px] font-bold tracking-[0.14em] whitespace-nowrap uppercase transition",
              active === t.id ? "border-brand text-ink" : "border-transparent text-subtle hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Panel id="overview" active={active}>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">About this product</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.description}</p>
          </div>
          <ul className="space-y-3 rounded-lg border border-line bg-white p-5">
            {product.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-deep">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel id="specs" active={active}>
        <dl className="grid overflow-hidden rounded-lg border border-line bg-white sm:grid-cols-2">
          {specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-4 border-b border-line px-5 py-3.5 text-sm sm:odd:border-r">
              <dt className="text-subtle">{s.label}</dt>
              <dd className={cn("text-right font-medium text-ink", s.label === "SKU" && "font-mono text-xs tracking-wider")}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {product.application && (
        <Panel id="application" active={active}>
          <div className="grid gap-10 lg:grid-cols-2">
            <dl className="grid grid-cols-2 gap-3">
              {[
                ["Mix ratio", product.application.mixRatio],
                ["Pot life", product.application.potLife],
                ["Recoat window", product.application.recoat],
                ["Light traffic", product.application.lightTraffic],
                ["Full cure", product.application.fullCure],
                ["Recommended coats", String(product.application.recommendedCoats)],
                ["Application temp.", product.application.temperature],
                ["Coverage", `${product.application.coverage.sqftPerUnit} sq ft ${product.application.coverage.basis}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-line bg-white p-4">
                  <dt className="text-[10px] font-semibold tracking-[0.16em] text-subtle uppercase">{label}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h2 className="font-display text-xl font-semibold">Application steps</h2>
              <ol className="mt-4 space-y-4">
                {product.application.steps.map((step, i) => (
                  <li key={step} className="flex gap-4 text-sm leading-relaxed text-muted">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-charcoal font-display text-xs font-bold text-gold">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Panel>
      )}

      <Panel id="documents" active={active}>
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {docs.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <FileText aria-hidden className="size-5 text-brand" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{d.title}</p>
                <p className="text-xs text-subtle">
                  {d.type} · {d.pages} pages · {formatFileSize(d.sizeKb)} · Rev. {formatDate(d.updated)}
                </p>
              </div>
              <a
                href={getDocHref(d)}
                target="_blank"
                rel="noopener"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3.5 text-[11px] font-bold tracking-[0.12em] text-ink uppercase transition hover:border-ink"
              >
                <Download aria-hidden className="size-3.5" /> PDF
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-subtle">Documents are generated placeholders for this demo storefront.</p>
      </Panel>

      <Panel id="reviews" active={active}>
        <ReviewsPanel product={product} reviews={reviews} />
      </Panel>
    </section>
  );
}

function Panel({ id, active, children }: { id: TabId; active: TabId; children: React.ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={active !== id} className="pt-8">
      {children}
    </div>
  );
}

function ReviewsPanel({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { requestCall } = useUI();
  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div className="rounded-lg border border-line bg-white p-6">
        <p className="font-display text-5xl font-bold text-ink">{product.rating.toFixed(1)}</p>
        <StarRating rating={product.rating} size={18} className="mt-2" />
        <p className="mt-2 text-sm text-subtle">Based on {product.reviewCount} verified reviews</p>
        <Button
          variant="outline"
          size="sm"
          block
          className="mt-6"
          onClick={() => requestCall({ title: `Review: ${product.name}`, detail: `SKU ${product.sku}` })}
        >
          <PenLine aria-hidden className="size-3.5" /> Write a review
        </Button>
      </div>
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StarRating rating={r.rating} />
              <span className="text-xs text-subtle">{formatDate(r.date)}</span>
            </div>
            <p className="mt-3 font-semibold text-ink">{r.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
            <p className="mt-3 text-xs text-subtle">
              <span className="font-semibold text-ink">{r.author}</span> · {r.role}
              {r.verified && <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Verified buyer</span>}
            </p>
          </li>
        ))}
        {product.reviewCount > reviews.length && (
          <li className="text-center text-xs text-subtle">
            Showing {reviews.length} of {product.reviewCount} reviews
          </li>
        )}
      </ul>
    </div>
  );
}
