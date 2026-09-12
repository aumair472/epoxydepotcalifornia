import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";
import { categories } from "@/data/mockData";
import { getCategory } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return cat ? { title: `${cat.name} Supplies`, description: cat.longDescription } : {};
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <Suspense fallback={<ShopFallback category={cat.slug} />}>
      <ShopView category={cat.slug} />
    </Suspense>
  );
}
