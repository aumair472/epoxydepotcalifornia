import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, FileText, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { CoverageCalculator } from "@/components/product/CoverageCalculator";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarRating } from "@/components/ui/StarRating";
import { products } from "@/data/mockData";
import {
  getCategory,
  getDocHref,
  getProduct,
  getProductDocs,
  getProductReviews,
  getProductSpecs,
  getRelatedProducts,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return product ? { title: product.name, description: product.shortDescription } : {};
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const docs = getProductDocs(product.id);
  const specs = getProductSpecs(product);
  const related = getRelatedProducts(product, 4);
  const lowStock = product.stock <= 10;
  const glance = specs.filter((s) => ["Package", "SKU", "Origin", "Shelf life", "Hazmat", "Coverage"].includes(s.label));

  return (
    <div className="container-page pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: category.name, href: `/shop/${category.slug}` }, { label: product.name }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} category={category} />

        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={`/shop/${category.slug}`} className="eyebrow hover:text-brand-dark">
              {category.name}
            </Link>
            {product.badge && <ProductBadge badge={product.badge} stock={product.stock} />}
          </div>
          <h1 className="mt-3 font-display text-[32px] leading-[1.1] font-bold text-ink md:text-[40px]">{product.name}</h1>
          <a href="#details" className="mt-3 inline-flex">
            <StarRating rating={product.rating} label={`${product.rating.toFixed(1)} · ${product.reviewCount} reviews`} />
          </a>

          <div className="mt-5 flex items-baseline gap-2">
            <p className="font-display text-4xl font-bold text-ink">{formatPrice(product.price)}</p>
            <p className="text-sm text-subtle">/ {product.packSize}</p>
          </div>
          <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">SKU {product.sku}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.description}</p>

          <p className={cn("mt-5 flex items-center gap-2 text-sm font-medium", lowStock ? "text-danger" : "text-emerald-700")}>
            <span className={cn("size-2 rounded-full", lowStock ? "bg-danger" : "bg-emerald-500")} />
            {lowStock ? `Only ${product.stock} left in stock` : "In stock — ready to ship"}
          </p>

          <div className="mt-5 border-t border-line pt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[13px] text-muted">
            <li className="flex items-center gap-2.5">
              <Truck aria-hidden className="size-4 text-brand" /> Ships in 24–48 hours from our California warehouse
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden className="size-4 text-brand" /> Lot-tested, batch-traceable product
            </li>
            <li className="flex items-center gap-2.5">
              <PackageCheck aria-hidden className="size-4 text-brand" /> Same-day will-call pickup available
            </li>
          </ul>

          {docs.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {docs.map((d) => (
                <a
                  key={d.id}
                  href={getDocHref(d)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-white px-3.5 text-[13px] font-medium text-ink transition hover:border-ink"
                >
                  <Download aria-hidden className="size-3.5" /> Download {d.type}
                </a>
              ))}
            </div>
          )}

          {product.application && (
            <div className="mt-6">
              <CoverageCalculator product={product} application={product.application} />
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
            <p className="border-b border-line px-4 py-3 font-sans text-[10.5px] font-semibold tracking-[0.18em] text-subtle uppercase">At a glance</p>
            <dl className="divide-y divide-line text-sm">
              {glance.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-subtle">{s.label}</dt>
                  <dd className={cn("text-right font-medium text-ink", s.label === "SKU" && "font-mono text-xs tracking-wider")}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#details" className="flex items-center gap-1.5 border-t border-line px-4 py-2.5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:bg-cream">
              <FileText aria-hidden className="size-3.5" /> Full specs & documents
            </a>
          </div>
        </div>
      </div>

      <ProductTabs product={product} specs={specs} docs={docs} reviews={getProductReviews(product)} />

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[28px] font-semibold text-ink md:text-3xl">More from {category.name}</h2>
            <Link href={`/shop/${category.slug}`} className="hidden items-center gap-1.5 text-[12px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark sm:inline-flex">
              View all <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ProductGrid products={related} columns={4} className="mt-8" />
        </section>
      )}
    </div>
  );
}
