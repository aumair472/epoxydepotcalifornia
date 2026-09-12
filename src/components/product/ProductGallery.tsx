"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/cn";
import type { Category, Product } from "@/types";

const views = [
  { id: "front", label: "Front view" },
  { id: "angle", label: "Angled view" },
  { id: "label", label: "Label detail" },
  { id: "in-use", label: "Application photo" },
] as const;

type ViewId = (typeof views)[number]["id"];

function Stage({ view, product, category, thumb = false }: { view: ViewId; product: Product; category: Category; thumb?: boolean }) {
  switch (view) {
    case "front":
      return (
        <div className={cn("absolute inset-0 bg-gradient-to-b from-cream-2/80 to-white", thumb ? "p-2" : "p-10 sm:p-16")}>
          <ProductImage product={product} />
        </div>
      );
    case "angle":
      return (
        <div className={cn("absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff,#ebe6da)]", thumb ? "p-2" : "p-12 sm:p-20")}>
          <ProductImage product={product} className="-rotate-6 drop-shadow-xl" />
        </div>
      );
    case "label":
      return (
        <div className="absolute inset-0 overflow-hidden bg-white">
          <ProductImage product={product} className="origin-[50%_68%] scale-[2.1]" />
        </div>
      );
    case "in-use":
      return (
        <div className="absolute inset-0 bg-charcoal">
          <Image src={category.image} alt={thumb ? "" : `${category.name} floor application`} fill sizes={thumb ? "120px" : "(min-width: 1024px) 600px, 100vw"} className="object-cover" />
          <span aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: category.tint, opacity: 0.45 }} />
          {!thumb && (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
              <Camera aria-hidden className="size-3.5" /> {category.name} application — reference photo
            </span>
          )}
        </div>
      );
  }
}

export function ProductGallery({ product, category }: { product: Product; category: Category }) {
  const [view, setView] = useState<ViewId>("front");
  return (
    <div className="lg:sticky lg:top-[212px] lg:self-start">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
        <Stage view={view} product={product} category={category} />
        {product.badge && <ProductBadge badge={product.badge} stock={product.stock} className="absolute top-4 left-4" />}
      </div>
      <div role="tablist" aria-label="Product images" className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            aria-label={v.label}
            onClick={() => setView(v.id)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition",
              view === v.id ? "border-brand" : "border-line hover:border-subtle/50"
            )}
          >
            <Stage view={v.id} product={product} category={category} thumb />
          </button>
        ))}
      </div>
    </div>
  );
}
