import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Newsletter } from "@/components/home/Newsletter";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { DocumentLibrary } from "@/components/resources/DocumentLibrary";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles, resourceCards, resourceDocs } from "@/data/mockData";
import { getUpcomingClasses } from "@/lib/catalog";
import { formatDateRange } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resources, Data Sheets & How-To Guides",
  description: "Technical data sheets, safety data sheets, color charts, mix guides, how-to articles and training for floor coating contractors.",
};

export default function ResourcesPage() {
  const classes = getUpcomingClasses(3);
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Specs, guides and training — built for contractors."
        body="Everything you need to spec the right system, prep the slab correctly and finish the job on schedule."
      />

      <section className="container-page py-12 md:py-16">
        <ul className="grid gap-4 md:grid-cols-2">
          {resourceCards.map((r) => (
            <li key={r.title}>
              <Link href={r.href} className="group flex h-full flex-col rounded-lg border border-line bg-white p-6 transition hover:border-brand/50 hover:shadow-[0_16px_32px_-24px_rgba(24,24,27,0.4)] md:p-7">
                <Icon name={r.icon} className="size-6 text-brand" />
                <h2 className="mt-5 font-display text-xl font-semibold text-ink">{r.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.longDescription}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-brand transition group-hover:gap-2">
                  {r.cta} <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="library" className="scroll-mt-52 border-y border-line bg-white py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Document library"
            title="Data sheets, SDS, color charts & mix guides"
            description={`Search ${resourceDocs.length} downloadable PDFs. Every system ships with a technical data sheet, and every chemical product has a safety data sheet.`}
          />
          <div className="mt-8">
            <DocumentLibrary />
          </div>
        </div>
      </section>

      <section id="guides" className="scroll-mt-52 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="How-to guides" title="From the workshop blog" description="Field-tested technique, spec advice and business tips from our install crews and tech reps." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            title="Upcoming training classes"
            action={
              <Link href="/training" className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
                Full schedule <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {classes.map((c) => (
              <li key={c.id} className="flex flex-col rounded-lg border border-line bg-cream p-5">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <CalendarDays aria-hidden className="size-4 text-brand" /> {formatDateRange(c.startDate, c.endDate)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                  <MapPin aria-hidden className="size-3.5" /> {c.city}
                </p>
                <p className="mt-4 font-semibold text-ink">{c.title}</p>
                <p className="mt-1 text-sm text-muted">{c.summary}</p>
                <ButtonLink href={`/training#${c.id}`} size="sm" variant="outline" className="mt-auto self-start">
                  Reserve seat
                </ButtonLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-16 md:pt-20">
        <Newsletter />
      </div>
    </>
  );
}
