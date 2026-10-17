import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories } from "@/data/mockData";
import { getCategory, getProductsByCategory } from "@/lib/catalog";
import { seoDescription, seoTitle } from "@/lib/seo";
import { collectionSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return cat ? { title: seoTitle(`${cat.name} Supplies`), description: seoDescription(cat.longDescription) } : {};
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <>
      <JsonLd data={collectionSchema(`${cat.name} Supplies`, cat.longDescription, `/shop/${cat.slug}`, getProductsByCategory(cat.slug))} />
      <Suspense fallback={<ShopFallback category={cat.slug} />}>
        <ShopView category={cat.slug} />
      </Suspense>
    </>
  );
}
