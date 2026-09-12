import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { workPaths, workPathsIntro } from "@/data/mockData";

/** DIY / We Install / Learn — the three-way path selector. */
export function PathSelector() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="container-page">
        <SectionHeading eyebrow={workPathsIntro.eyebrow} title={workPathsIntro.title} description={workPathsIntro.body} />
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {workPaths.map((p) => (
            <li key={p.id}>
              <Link
                href={p.cta.href}
                className="group flex h-full flex-col rounded-xl bg-charcoal p-6 text-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.7)] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/45 uppercase">{p.kicker}</p>
                  <Icon name={p.icon} className="size-5 text-gold/80" strokeWidth={1.6} />
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{p.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[13px] font-semibold text-brand transition group-hover:gap-2.5">
                  {p.cta.label} <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
