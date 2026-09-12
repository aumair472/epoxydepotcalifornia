import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBestsellers } from "@/lib/catalog";

export function Bestsellers() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Bestsellers"
          title="The floor coating supplies crews reorder most"
          action={
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
              Shop all <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <ProductGrid products={getBestsellers(4)} columns={4} className="mt-10" />
      </div>
    </section>
  );
}
