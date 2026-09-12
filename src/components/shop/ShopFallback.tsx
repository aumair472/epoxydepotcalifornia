import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { filterProducts, getCategory, sortProducts } from "@/lib/catalog";
import { pluralize } from "@/lib/format";
import type { CategorySlug } from "@/types";

/**
 * Server-rendered stand-in for ShopView while it reads URL params on the client.
 * Keeps the same layout and ships the unfiltered product grid in the initial HTML.
 */
export function ShopFallback({ category }: { category?: CategorySlug }) {
  const cat = category ? getCategory(category) : undefined;
  const results = sortProducts(filterProducts({ category }), "featured");
  return (
    <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs items={cat ? [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: cat.name }] : [{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mt-5 max-w-2xl">
        <p className="eyebrow">Shop</p>
        <h1 className="mt-2 font-display text-[34px] leading-tight font-bold text-ink md:text-[40px]">{cat?.name ?? "All Products"}</h1>
        {cat && <p className="mt-2 text-[15px] leading-relaxed text-muted">{cat.longDescription}</p>}
        <p className="mt-2 text-sm text-subtle">{pluralize(results.length, "product")} found</p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[232px_1fr] lg:gap-10">
        <div aria-hidden className="hidden space-y-2 lg:block">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-cream-2" />
          ))}
        </div>
        <ProductGrid products={results} columns={3} />
      </div>
    </div>
  );
}
