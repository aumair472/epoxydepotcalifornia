import Link from "next/link";
import { Flame } from "lucide-react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { ProductBadge } from "@/components/product/ProductBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { featuredOffer } from "@/data/mockData";
import { getCategoryName } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice, formatProductPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({
  product,
  compact = false,
  eager = false,
  className,
}: {
  product: Product;
  compact?: boolean;
  /** First cards on the page: load the photo right away (it is usually the LCP). */
  eager?: boolean;
  className?: string;
}) {
  const href = `/product/${product.id}`;
  const hotDeal = product.id === featuredOffer.productId;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#d6cebd] hover:shadow-[0_16px_32px_-20px_rgba(24,24,27,0.4)]",
        hotDeal && "animate-hot-glow border-2 border-sale hover:border-sale",
        className
      )}
    >
      {hotDeal && (
        <p className="flex items-center justify-between gap-1.5 bg-sale px-2 py-2 text-[10.5px] leading-none font-bold tracking-[0.04em] whitespace-nowrap text-white uppercase sm:px-4 sm:text-xs sm:tracking-[0.12em]">
          <span className="inline-flex items-center gap-1">
            <Flame aria-hidden className="size-3.5 fill-gold text-gold sm:size-4" /> Hot deal
          </span>
          <span>{featuredOffer.percentOff}% off</span>
        </p>
      )}
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square bg-gradient-to-b from-cream-2/80 to-white p-5 sm:p-7">
        <ProductImage product={product} eager={eager} className="transition-transform duration-300 group-hover:scale-[1.04]" />
        {product.badge && !hotDeal && <ProductBadge badge={product.badge} stock={product.stock} className="absolute top-3 left-3" />}
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
            <p className={cn("font-display text-lg leading-none font-bold", product.compareAtPrice ? "text-sale" : "text-ink")}>
              {product.compareAtPrice && <s className="mr-1.5 text-sm font-medium text-subtle">{formatPrice(product.compareAtPrice)}</s>}
              {formatProductPrice(product)}
            </p>
            {product.priceNote && <p className="mt-1 text-[11px] font-medium text-muted">{product.priceNote}</p>}
            <p className="mt-1 text-[11px] text-subtle">{product.packSize}</p>
          </div>
          <CallToOrderButton productId={product.id} variant={hotDeal ? "sale" : undefined} />
        </div>
      </div>
    </article>
  );
}
