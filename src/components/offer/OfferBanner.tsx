import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CallToOrderButton } from "@/components/call/CallToOrderButton";
import { ButtonLink } from "@/components/ui/Button";
import { featuredOffer } from "@/data/mockData";
import { getProduct } from "@/lib/catalog";
import { formatPrice, formatProductPrice } from "@/lib/format";

/** Home page promo for the current offer: copy on the left, the floor photo bleeding off the right edge. */
export function OfferBanner() {
  const product = getProduct(featuredOffer.productId);
  if (!product) return null;
  const href = `/product/${product.id}`;

  return (
    <section aria-labelledby="offer-title" className="relative overflow-hidden border-t-4 border-sale bg-charcoal text-white">
      <div className="relative aspect-[2/1] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[62%]">
        <Image src={featuredOffer.image} alt={featuredOffer.imageAlt} fill sizes="(min-width: 768px) 62vw, 100vw" className="object-cover md:object-right" />
        <span aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-charcoal via-charcoal/50 via-20% to-transparent to-50% md:block" />
      </div>

      <div className="container-page relative pb-10 md:py-14 lg:py-20">
        <div className="md:max-w-[46%] lg:max-w-[40%]">
          <p className="-mt-9 inline-block -rotate-2 bg-sale px-4 py-2 font-display text-[44px] leading-none font-bold tracking-[-0.02em] shadow-[6px_6px_0_rgba(0,0,0,0.35)] md:mt-0 lg:text-[64px]">
            {featuredOffer.percentOff}% off
          </p>
          <h2 id="offer-title" className="mt-6 font-display text-[30px] leading-[1.1] font-bold tracking-[-0.01em] text-white lg:text-[40px]">
            {featuredOffer.headline}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">{featuredOffer.body}</p>
          <p className="mt-5 font-display text-xl font-semibold">
            {product.compareAtPrice && <s className="mr-2 font-medium text-white/60">{formatPrice(product.compareAtPrice)}</s>}
            {product.callForPrice ? "Call for your sale price" : formatProductPrice(product)}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={href} variant="sale" size="lg">
              Shop now <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <CallToOrderButton productId={product.id} label="Call to order" size="lg" variant="outline-light" />
          </div>
        </div>
      </div>
    </section>
  );
}
