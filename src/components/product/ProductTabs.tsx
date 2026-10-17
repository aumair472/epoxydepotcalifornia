"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { ContactCards } from "@/components/contact/ContactCards";
import { cn } from "@/lib/cn";
import type { Product, Spec } from "@/types";

type TabId = "overview" | "specs" | "application" | "documents";

interface ProductTabsProps {
  product: Product;
  specs: Spec[];
}

export function ProductTabs({ product, specs }: ProductTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    ...(product.application ? [{ id: "application" as const, label: "Application & mix" }] : []),
    { id: "documents", label: "Data sheets" },
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
        <div className="max-w-3xl">
          <h2 className="font-display text-xl font-semibold">Technical & safety data sheets</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Call or email us and we&apos;ll send the manufacturer&apos;s current TDS and SDS for {product.name}. Always read both before you store, mix or apply the
            product.
          </p>
          <ContactCards
            showVisit={false}
            emailSubject={`TDS / SDS request: ${product.name} (SKU ${product.sku})`}
            emailBody={`Please send the TDS and SDS for ${product.name} (SKU ${product.sku}).\n`}
            className="mt-5"
          />
        </div>
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
