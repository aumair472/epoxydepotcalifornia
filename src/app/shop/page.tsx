import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";
import { JsonLd } from "@/components/seo/JsonLd";
import { products } from "@/data/mockData";
import { collectionSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Shop All Floor Coating Supplies",
  description: "Epoxy, polyaspartic, urethane, flake, pigments, stains, concrete prep and tools — filter by category, price and pack size.",
};

export default function ShopPage() {
  return (
    <>
      <JsonLd data={collectionSchema("Shop All Floor Coating Supplies", String(metadata.description), "/shop", products)} />
      <Suspense fallback={<ShopFallback />}>
        <ShopView />
      </Suspense>
    </>
  );
}
