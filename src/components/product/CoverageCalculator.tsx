"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { calculateCoverage } from "@/lib/coverage";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { ApplicationInfo, Product } from "@/types";

const GARAGE_PRESETS = [
  { label: "1-car", sqft: 250 },
  { label: "2-car", sqft: 500 },
  { label: "3-car", sqft: 750 },
];

const inputClass =
  "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function CoverageCalculator({ product, application }: { product: Product; application: ApplicationInfo }) {
  const { coverage } = application;
  const floorScale = coverage.sqftPerUnit >= 100;
  const [sqftText, setSqftText] = useState(String(floorScale ? 500 : Math.ceil(coverage.sqftPerUnit * 3)));
  const [coats, setCoats] = useState(application.recommendedCoats);
  const [milsText, setMilsText] = useState(String(coverage.atMils ?? ""));

  const sqft = Math.max(0, Number(sqftText) || 0);
  const mils = coverage.atMils ? Math.max(1, Number(milsText) || coverage.atMils) : undefined;
  const result = calculateCoverage(coverage, { sqft, coats, mils });

  return (
    <div className="rounded-lg border border-line bg-white">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Calculator aria-hidden className="size-4 text-brand" />
        <h2 className="font-sans text-[10.5px] font-semibold tracking-[0.18em] text-subtle uppercase">Coverage calculator</h2>
      </div>
      <div className="space-y-4 p-4">
        <div className={cn("grid gap-3", coverage.atMils ? "grid-cols-3" : "grid-cols-2")}>
          <label className="col-span-1 text-xs font-medium text-muted">
            Area (sq ft)
            <input
              inputMode="numeric"
              value={sqftText}
              onChange={(e) => setSqftText(e.target.value.replace(/[^\d.]/g, ""))}
              className={cn(inputClass, "mt-1")}
            />
          </label>
          <label className="text-xs font-medium text-muted">
            Coats
            <select value={coats} onChange={(e) => setCoats(Number(e.target.value))} className={cn(inputClass, "mt-1")}>
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {coverage.atMils && (
            <label className="text-xs font-medium text-muted">
              Thickness (mils)
              <input
                inputMode="numeric"
                value={milsText}
                onChange={(e) => setMilsText(e.target.value.replace(/[^\d.]/g, ""))}
                className={cn(inputClass, "mt-1")}
              />
            </label>
          )}
        </div>
        {floorScale && (
          <div className="flex flex-wrap gap-1.5">
            {GARAGE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSqftText(String(p.sqft))}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  sqft === p.sqft ? "border-brand bg-brand/10 text-brand-deep" : "border-line text-muted hover:border-brand"
                )}
              >
                {p.label} garage · {p.sqft} sq ft
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-md bg-cream px-4 py-3" aria-live="polite">
          <div>
            <p className="text-xs text-muted">You&apos;ll need</p>
            <p className="font-display text-2xl leading-tight font-bold text-ink">
              {result.units} × <span className="text-lg">{product.packSize}</span>
            </p>
            <p className="text-xs text-subtle">
              ≈ {formatPrice(result.units * product.price)} · ~{Math.round(result.sqftPerUnit).toLocaleString("en-US")} sq ft per unit
              {mils ? ` at ${mils} mils` : ""}
            </p>
          </div>
          {result.units > 0 && (
            <AddToCartButton productId={product.id} quantity={result.units} label={`Add ${result.units}`} size="sm" icon="cart" />
          )}
        </div>
        <p className="text-[11px] leading-relaxed text-subtle">
          Estimate based on {coverage.basis}. Porous or rough slabs use more — add 10% for waste.
        </p>
      </div>
    </div>
  );
}
