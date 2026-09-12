import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Floor Coating Supplies",
  description: "Epoxy, polyaspartic, urethane, flake, pigments, stains, concrete prep and tools — filter by category, price and pack size.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopView />
    </Suspense>
  );
}
