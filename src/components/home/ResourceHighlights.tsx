import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resourceCards, resourcesIntro } from "@/data/mockData";

export function ResourceHighlights() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-page">
        <SectionHeading title={resourcesIntro.title} description={resourcesIntro.body} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resourceCards.map((r) => (
            <li key={r.title}>
              <Link href={r.href} className="group flex h-full flex-col rounded-lg border border-line bg-cream p-5 transition hover:border-brand/50 hover:bg-white">
                <Icon name={r.icon} className="size-5 text-brand" />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase transition group-hover:gap-2">
                  Open <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
