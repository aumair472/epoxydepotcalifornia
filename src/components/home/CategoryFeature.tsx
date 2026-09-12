import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { CategoryFeature as Feature } from "@/types";

/** Alternating category band: dark icon tile on one side, copy + bullets + CTAs on the other. */
export function CategoryFeature({ feature, index }: { feature: Feature; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <section className={cn("py-16 md:py-20", flipped ? "bg-cream" : "bg-white")} aria-labelledby={`feature-${feature.id}`}>
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={cn("flex justify-center", flipped ? "md:order-2" : "md:order-1")}>
          <div className="grid size-36 place-items-center rounded-2xl bg-charcoal shadow-[0_28px_50px_-24px_rgba(0,0,0,0.55)] sm:size-44">
            <Icon name={feature.icon} className="size-12 text-gold sm:size-14" strokeWidth={1.4} />
          </div>
        </div>
        <div className={cn(flipped ? "md:order-1" : "md:order-2")}>
          <p className="eyebrow">{feature.eyebrow}</p>
          <h2 id={`feature-${feature.id}`} className="mt-3 font-display text-[28px] leading-[1.15] font-semibold text-ink md:text-4xl">
            {feature.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{feature.body}</p>
          <ul className="mt-6 grid gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {feature.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 shrink-0 rounded-[1px] bg-brand" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {feature.ctas.map((cta) => (
              <ButtonLink key={cta.href} href={cta.href} variant={cta.variant} size="md">
                {cta.label} <ArrowRight aria-hidden className="size-3.5" />
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
