"use client";

import Link from "next/link";
import { useState } from "react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<string>();

  return (
    <div>
      {product.colors && (
        <fieldset className="mb-5">
          <legend className="text-[13px] font-semibold text-ink">
            Color: <span className="font-normal text-muted">{color ?? `Choose from ${product.colors.length}`}</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-pressed={color === c.name}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "size-9 rounded-full border border-black/15 ring-offset-2 transition-shadow hover:ring-2 hover:ring-line",
                  color === c.name && "ring-2 ring-brand hover:ring-brand",
                )}
                style={{ backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 55%)`, backgroundColor: c.hex }}
              />
            ))}
          </div>
        </fieldset>
      )}
      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={setQty} size="md" label="Quantity" />
        <CallToOrderButton productId={product.id} quantity={qty} option={color} label="Call to order" size="lg" block className="h-12 flex-1 text-[12px]" />
      </div>
      <Link
        href={`/contact?topic=quote&sku=${encodeURIComponent(product.sku)}`}
        className="mt-3 block text-center text-[13px] font-medium text-brand-deep hover:underline"
      >
        Request a quote on this SKU →
      </Link>
    </div>
  );
}
