import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { ContactCards } from "@/components/contact/ContactCards";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles, resourceCards, resourceDocs } from "@/data/mockData";
import { getDocHref } from "@/lib/catalog";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Resources, Data Sheets & How-To Guides",
  description: "Technical data sheets, safety data sheets, color charts, mix guides, how-to articles and training for floor coating contractors.",
};

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={webPageSchema("CollectionPage", "Resources, Data Sheets & How-To Guides", String(metadata.description), "/resources")} />
      <PageHeader
        eyebrow="Resources"
        breadcrumbs={[{ label: "Resources" }]}
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
            eyebrow="Data sheets"
            title="TDS & SDS on request"
            description="Need the technical data sheet or safety data sheet for a product? Call or email us with the product name and we'll send the manufacturer's current sheet."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <ContactCards showVisit={false} emailSubject="TDS / SDS request" emailBody={"Product(s):\nTDS, SDS or both:\n"} className="sm:grid-cols-1" />
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">Printable color charts</p>
              <ul className="mt-3 divide-y divide-line overflow-hidden rounded-lg border border-line">
                {resourceDocs.map((d) => (
                  <li key={d.id}>
                    <a href={getDocHref(d)} target="_blank" rel="noopener" className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-cream">
                      <FileText aria-hidden className="size-4 shrink-0 text-brand" />
                      <span className="min-w-0 flex-1 font-medium text-ink">{d.title}</span>
                      <Download aria-hidden className="size-4 text-subtle" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
    </>
  );
}
