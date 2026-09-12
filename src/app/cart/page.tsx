import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-5 mb-8 font-display text-[34px] font-bold text-ink md:text-[40px]">Your cart</h1>
      <CartView />
    </div>
  );
}
