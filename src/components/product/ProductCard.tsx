import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { getCategoryName } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product, compact = false, className }: { product: Product; compact?: boolean; className?: string }) {
  const href = `/product/${product.id}`;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#d6cebd] hover:shadow-[0_16px_32px_-20px_rgba(24,24,27,0.4)]",
        className
      )}
    >
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square bg-gradient-to-b from-cream-2/80 to-white p-5 sm:p-7">
        <ProductImage product={product} className="transition-transform duration-300 group-hover:scale-[1.04]" />
        {product.badge && <ProductBadge badge={product.badge} stock={product.stock} className="absolute top-3 left-3" />}
      </Link>
      <div className={cn("flex flex-1 flex-col border-t border-line/70", compact ? "p-3" : "p-3 sm:p-4")}>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-subtle uppercase">{getCategoryName(product.category)}</p>
        <h3 className="mt-1.5 font-display text-[15px] leading-snug font-semibold text-ink sm:text-base">
          <Link href={href} className="transition-colors hover:text-brand">
            {product.name}
          </Link>
        </h3>
        {!compact && <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted">{product.shortDescription}</p>}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-lg leading-none font-bold text-ink">{formatPrice(product.price)}</p>
            <p className="mt-1 text-[11px] text-subtle">{product.packSize}</p>
          </div>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
