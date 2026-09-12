"use client";

import Link from "next/link";
import { CircleCheck, ShoppingCart, X } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/data/mockData";
import { getBestsellers, getProduct } from "@/lib/catalog";
import { formatPrice, pluralize } from "@/lib/format";

export function CartDrawer() {
  const { isOpen, closeCart, items, itemCount, subtotal, lastAddedId } = useCart();
  const lastAdded = lastAddedId && items.some((i) => i.product.id === lastAddedId) ? getProduct(lastAddedId) : undefined;

  return (
    <Drawer open={isOpen} onClose={closeCart} label="Shopping cart">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Your cart</h2>
          <p className="text-xs text-subtle">{pluralize(itemCount, "item")}</p>
        </div>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Close cart"
          className="grid size-9 place-items-center rounded-md text-subtle transition hover:bg-cream hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </header>

      {items.length === 0 ? (
        <EmptyCart onNavigate={closeCart} />
      ) : (
        <>
          {lastAdded && (
            <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-2.5 text-[13px] text-emerald-800" aria-live="polite">
              <CircleCheck aria-hidden className="size-4 shrink-0" />
              <span className="truncate">
                Added <strong className="font-semibold">{lastAdded.name}</strong>
              </span>
            </div>
          )}
          <div className="border-b border-line bg-cream/60 px-5 py-3">
            <FreeShippingMeter subtotal={subtotal} />
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5">
            {items.map((item) => (
              <CartLineItem key={item.product.id} item={item} highlight={item.product.id === lastAddedId} onNavigate={closeCart} />
            ))}
          </ul>
          <footer className="space-y-3 border-t border-line bg-white px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-display text-xl font-bold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs leading-relaxed text-subtle">
              Shipping and tax calculated at checkout. Contractors save {siteConfig.contractorDiscount * 100}% —{" "}
              <Link href="/contractors" onClick={closeCart} className="font-semibold text-brand-deep hover:underline">
                apply here
              </Link>
              .
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href="/cart" variant="outline" onClick={closeCart}>
                View cart
              </ButtonLink>
              <ButtonLink href="/cart#checkout" onClick={closeCart}>
                Checkout
              </ButtonLink>
            </div>
          </footer>
        </>
      )}
    </Drawer>
  );
}

function EmptyCart({ onNavigate }: { onNavigate: () => void }) {
  const suggestions = getBestsellers(3);
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
          <ShoppingCart className="size-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">Your cart is empty</h3>
        <p className="mt-1 text-sm text-muted">Tap “Add” on any product and it lands here instantly.</p>
        <ButtonLink href="/shop" onClick={onNavigate} className="mt-5">
          Shop the warehouse
        </ButtonLink>
      </div>
      <div className="mt-10">
        <p className="eyebrow mb-3">Popular right now</p>
        <ul className="space-y-3">
          {suggestions.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-lg border border-line p-2.5">
              <div className="size-14 shrink-0 rounded bg-gradient-to-b from-cream-2 to-white p-1">
                <ProductImage product={p} />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${p.id}`} onClick={onNavigate} className="line-clamp-1 text-sm font-semibold text-ink hover:text-brand">
                  {p.name}
                </Link>
                <p className="text-xs text-subtle">{formatPrice(p.price)}</p>
              </div>
              <AddToCartButton productId={p.id} size="xs" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
