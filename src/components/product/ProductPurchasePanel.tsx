"use client";

import Image from "next/image";
import { useState } from "react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { EmailLink } from "@/components/contact/EmailLink";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<string>();
  const [size, setSize] = useState<string>();
  const option = [size, color].filter(Boolean).join(" · ") || undefined;
  const colorPhoto = product.colors?.find((c) => c.name === color)?.image;

  return (
    <div>
      {product.priceOptions && (
        <fieldset className="mb-5">
          <legend className="text-[13px] font-semibold text-ink">
            Size: <span className="font-normal text-muted">{size ?? "Choose a size"}</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.priceOptions.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setSize(o.label)}
                aria-pressed={size === o.label}
                className={cn(
                  "rounded-md border px-3 py-2 text-left transition-colors",
                  size === o.label ? "border-brand bg-brand/5" : "border-line bg-white hover:border-subtle",
                )}
              >
                <span className="block text-[13px] font-semibold text-ink">{o.label}</span>
                <span className="block font-mono text-[11px] text-muted">{formatPrice(o.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
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
          {colorPhoto && (
            <Image src={colorPhoto} alt={`${color} sample`} width={160} height={160} className="mt-3 size-28 rounded-lg border border-line object-cover" />
          )}
        </fieldset>
      )}
      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={setQty} size="md" label="Quantity" />
        <CallToOrderButton productId={product.id} quantity={qty} option={option} label="Call to order" size="lg" block className="h-12 flex-1 text-[12px]" />
      </div>
      <EmailLink
        hideAddress
        subject={`Quote request: ${product.name} (SKU ${product.sku})`}
        body={`Product: ${product.name}\nSKU: ${product.sku}${option ? `\nOption: ${option}` : ""}\nQuantity: ${qty}\n\nName:\nPhone:\nShip to / pickup:`}
        className="mt-3 block text-center text-[13px] font-medium text-brand-deep hover:underline"
      >
        Email us for a quote on this SKU →
      </EmailLink>
    </div>
  );
}
