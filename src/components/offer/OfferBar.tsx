import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredOffer } from "@/data/mockData";

const barClass = "flex min-h-10 items-center justify-center gap-2.5 bg-sale px-4 py-2 text-center text-[13px] text-white sm:gap-3 sm:text-sm";

function Message() {
  return (
    <>
      <span className="shrink-0 rounded-sm bg-white px-1.5 py-0.5 text-[11px] leading-none font-bold text-sale">New</span>
      <span>
        <span className="font-semibold">{featuredOffer.name}</span>, <span className="font-bold">{featuredOffer.percentOff}% off</span>
      </span>
    </>
  );
}

/** Red promo strip at the top of the home and product pages. Not a link on the offer's own product page. */
export function OfferBar({ linked = true }: { linked?: boolean }) {
  if (!linked) {
    return (
      <p className={barClass}>
        <Message />
      </p>
    );
  }
  return (
    <Link href={`/product/${featuredOffer.productId}`} className={`${barClass} group transition-colors hover:bg-sale-dark`}>
      <Message />
      <span className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-2">
        Shop now <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
