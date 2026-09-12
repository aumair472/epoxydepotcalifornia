"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { getQuantity, openCart } = useCart();
  const inCart = getQuantity(product.id);

  return (
    <div>
      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={setQty} size="md" label="Quantity" />
        <AddToCartButton productId={product.id} quantity={qty} label="Add to cart" icon="cart" size="lg" block className="h-12 flex-1 text-[12px]" />
      </div>
      {inCart > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-emerald-700">
          <CircleCheck aria-hidden className="size-4" />
          {inCart} in your cart ·
          <button type="button" onClick={openCart} className="font-semibold underline-offset-2 hover:underline">
            View cart
          </button>
        </p>
      )}
      <Link
        href={`/contact?topic=quote&sku=${encodeURIComponent(product.sku)}`}
        className="mt-3 block text-center text-[13px] font-medium text-brand-deep hover:underline"
      >
        Request a quote on this SKU →
      </Link>
    </div>
  );
}
