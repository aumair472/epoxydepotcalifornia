import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { heroContent } from "@/data/mockData";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[52%] bg-[radial-gradient(ellipse_at_70%_20%,rgba(249,115,22,0.10),transparent_60%),linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0.55))] lg:block"
      />
      <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.18em] text-brand uppercase">
            <Sparkles aria-hidden className="size-3.5" />
            {heroContent.badge}
          </span>
          <h1 className="mt-6 font-display text-[40px] leading-[1.04] font-bold tracking-[-0.02em] text-ink sm:text-5xl lg:text-[60px]">
            {heroContent.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-[17px]">{heroContent.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={heroContent.primaryCta.href} size="lg">
              {heroContent.primaryCta.label} <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href={heroContent.secondaryCta.href} size="lg" variant="outline">
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-col gap-2.5 text-[10.5px] font-medium tracking-[0.16em] text-muted uppercase sm:flex-row sm:flex-wrap sm:gap-x-7">
            {heroContent.trust.map((t) => (
              <li key={t.label} className="inline-flex items-center gap-2">
                <Icon name={t.icon} className="size-3.5 text-brand" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
        <CategoryTiles slugs={heroContent.tileSlugs} />
      </div>
    </section>
  );
}
