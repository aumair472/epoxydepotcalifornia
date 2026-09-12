"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

interface CartLineItemProps {
  item: CartItem;
  highlight?: boolean;
  onNavigate?: () => void;
  size?: "sm" | "md";
}

export function CartLineItem({ item, highlight, onNavigate, size = "sm" }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, lineTotal } = item;
  const thumb = size === "md" ? "size-24" : "size-[72px]";

  return (
    <li className={cn("flex gap-4 rounded-lg py-4", highlight && "animate-flash")}>
      <Link
        href={`/product/${product.id}`}
        onClick={onNavigate}
        className={cn("shrink-0 overflow-hidden rounded-md border border-line bg-gradient-to-b from-cream-2 to-white p-1.5", thumb)}
        aria-label={product.name}
      >
        <ProductImage product={product} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${product.id}`}
              onClick={onNavigate}
              className="line-clamp-2 font-display text-[15px] leading-snug font-semibold text-ink hover:text-brand"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-subtle">
              {product.packSize} · {formatPrice(product.price)} ea
            </p>
          </div>
          <p className="shrink-0 font-display text-[15px] font-bold text-ink">{formatPrice(lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper value={quantity} onChange={(q) => updateQuantity(product.id, q)} label={`Quantity for ${product.name}`} />
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="inline-flex items-center gap-1.5 text-xs text-subtle transition hover:text-danger"
          >
            <Trash2 aria-hidden className="size-3.5" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
