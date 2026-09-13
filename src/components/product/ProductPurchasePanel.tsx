"use client";

import Link from "next/link";
import { useState } from "react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  return (
    <div>
      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={setQty} size="md" label="Quantity" />
        <CallToOrderButton productId={product.id} quantity={qty} label="Call to order" size="lg" block className="h-12 flex-1 text-[12px]" />
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
