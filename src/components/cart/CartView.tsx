"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CircleCheck, ShoppingCart, Store, Tag, Trash2, Truck } from "lucide-react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { siteConfig } from "@/data/mockData";
import { useHydrated } from "@/hooks/useHydrated";
import { getBestsellers } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice, makeReference, pluralize } from "@/lib/format";

const PROMO_CODE = "CONTRACTOR15";
const FLAT_SHIPPING = 49;
const CA_TAX_RATE = 0.0725;

interface Confirmation {
  reference: string;
  total: number;
  itemCount: number;
  fulfillment: "ship" | "pickup";
}

export function CartView() {
  const hydrated = useHydrated();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [promo, setPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [fulfillment, setFulfillment] = useState<"ship" | "pickup">("ship");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [placing, setPlacing] = useState(false);

  const discount = promo ? subtotal * siteConfig.contractorDiscount : 0;
  const afterDiscount = subtotal - discount;
  const freeShipping = fulfillment === "pickup" || afterDiscount >= siteConfig.freeShippingThreshold;
  const shipping = freeShipping ? 0 : FLAT_SHIPPING;
  const tax = afterDiscount * CA_TAX_RATE;
  const total = afterDiscount + shipping + tax;

  const applyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("promo") ?? "").trim().toUpperCase();
    if (code === PROMO_CODE) {
      setPromo(code);
      setPromoError("");
      toast({ title: "Contractor discount applied", description: "15% off your order (demo code)." });
    } else {
      setPromoError(code ? "That code isn't valid." : "Enter a promo code.");
    }
  };

  const placeOrder = () => {
    setPlacing(true);
    window.setTimeout(() => {
      setConfirmation({ reference: makeReference("ED"), total, itemCount, fulfillment });
      clearCart();
      setPromo(null);
      setPlacing(false);
    }, 900);
  };

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]" aria-busy="true">
        <div className="h-72 animate-pulse rounded-xl bg-cream-2" />
        <div className="h-72 animate-pulse rounded-xl bg-cream-2" />
      </div>
    );
  }

  const confirmationModal = (
    <Modal open={confirmation !== null} onClose={() => setConfirmation(null)} title="Order request received" size="sm" bare>
      {confirmation && (
        <div className="px-6 py-10 text-center" role="status">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CircleCheck className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold">Order request received</h2>
          <p className="mt-2 text-sm text-muted">
            {pluralize(confirmation.itemCount, "item")} · {formatPrice(confirmation.total)} ·{" "}
            {confirmation.fulfillment === "pickup" ? "Will-call pickup" : "Ground shipping"}
          </p>
          <p className="mt-4 inline-block rounded-md bg-cream px-3 py-1.5 font-mono text-xs tracking-wider text-muted">Order #{confirmation.reference}</p>
          <p className="mx-auto mt-5 max-w-xs text-xs leading-relaxed text-subtle">
            This is a demo storefront — no payment was taken and nothing was sent. In production, checkout would continue to payment here.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/shop" onClick={() => setConfirmation(null)}>
              Keep shopping
            </ButtonLink>
          </div>
        </div>
      )}
    </Modal>
  );

  if (items.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
            <ShoppingCart className="size-6" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted">Add products from the shop and they&apos;ll show up here instantly.</p>
          <ButtonLink href="/shop" className="mt-6">
            Shop the warehouse
          </ButtonLink>
        </div>
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">Bestsellers</h2>
          <ProductGrid products={getBestsellers(4)} columns={4} className="mt-6" />
        </section>
        {confirmationModal}
      </>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div>
          <div className="rounded-xl border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <FreeShippingMeter subtotal={afterDiscount} />
            </div>
            <ul className="divide-y divide-line px-5">
              {items.map((item) => (
                <CartLineItem key={item.product.id} item={item} size="md" />
              ))}
            </ul>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand">
              <ArrowLeft aria-hidden className="size-4" /> Continue shopping
            </Link>
            <button
              type="button"
              onClick={() => {
                clearCart();
                toast({ title: "Cart cleared", tone: "info" });
              }}
              className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-danger"
            >
              <Trash2 aria-hidden className="size-4" /> Clear cart
            </button>
          </div>
        </div>

        <aside id="checkout" className="scroll-mt-56 lg:sticky lg:top-[212px] lg:self-start">
          <div className="rounded-xl border border-line bg-white p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Order summary</h2>

            <fieldset className="mt-5">
              <legend className="text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">Fulfillment</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "ship", label: "Ship to me", icon: Truck },
                    { id: "pickup", label: "Will-call", icon: Store },
                  ] as const
                ).map((o) => (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition",
                      fulfillment === o.id ? "border-brand bg-brand/10 text-brand-deep" : "border-line text-ink hover:border-subtle/50"
                    )}
                  >
                    <input type="radio" name="fulfillment" value={o.id} checked={fulfillment === o.id} onChange={() => setFulfillment(o.id)} className="sr-only" />
                    <o.icon aria-hidden className="size-4" /> {o.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <dl className="mt-6 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal ({pluralize(itemCount, "item")})</dt>
                <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
              </div>
              {promo && (
                <div className="flex justify-between text-emerald-700">
                  <dt className="inline-flex items-center gap-1.5">
                    <Tag aria-hidden className="size-3.5" /> {promo}
                    <button type="button" onClick={() => setPromo(null)} className="text-xs text-subtle underline hover:text-danger">
                      remove
                    </button>
                  </dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">{fulfillment === "pickup" ? "Will-call pickup" : "Shipping (ground)"}</dt>
                <dd className="font-medium text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Est. tax (CA 7.25%)</dt>
                <dd className="font-medium text-ink">{formatPrice(tax)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold text-ink">Estimated total</dt>
                <dd className="font-display text-2xl font-bold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>

            {!promo && (
              <form onSubmit={applyPromo} className="mt-5" noValidate>
                <label htmlFor="promo" className="text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">
                  Promo code
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="promo"
                    name="promo"
                    placeholder="Try CONTRACTOR15"
                    aria-invalid={Boolean(promoError)}
                    className="h-10 min-w-0 flex-1 rounded-md border border-line px-3 text-sm uppercase outline-none placeholder:normal-case focus:border-brand aria-invalid:border-danger"
                  />
                  <Button type="submit" variant="dark" size="sm" className="h-10">
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p role="alert" className="mt-1.5 text-xs text-danger">
                    {promoError}
                  </p>
                )}
              </form>
            )}

            <Button block size="lg" className="mt-6" onClick={placeOrder} disabled={placing}>
              {placing ? "Placing order…" : "Place order request"}
            </Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-subtle">
              Demo checkout — no payment details are collected. Need net-30 terms?{" "}
              <Link href="/contractors" className="font-semibold text-brand-deep hover:underline">
                Apply as a contractor
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
      {confirmationModal}
    </>
  );
}
