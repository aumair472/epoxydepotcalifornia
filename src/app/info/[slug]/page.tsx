import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { infoPages, siteConfig } from "@/data/mockData";
import { getInfoPage } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/info/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  return page ? { title: page.title, description: page.intro } : {};
}

export default async function InfoPage({ params }: PageProps<"/info/[slug]">) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();
  const siblings = infoPages.filter((p) => p.eyebrow === page.eyebrow);

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} body={page.intro} breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label={`${page.eyebrow} pages`} className="lg:sticky lg:top-[212px] lg:self-start">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-subtle uppercase">{page.eyebrow}</p>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
            {siblings.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/info/${p.slug}`}
                  aria-current={p.slug === page.slug ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition",
                    p.slug === page.slug ? "bg-brand/15 font-semibold text-brand-deep" : "text-ink hover:bg-white"
                  )}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl">
          {page.sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-ink">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-base leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <div className="mt-12 flex flex-col gap-4 rounded-xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-ink">Questions? We&apos;re here {siteConfig.hours}.</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 text-brand-deep hover:underline">
                <Phone aria-hidden className="size-4" /> {siteConfig.phone}
              </a>
              <a href={siteConfig.emailHref} className="inline-flex items-center gap-1.5 text-brand-deep hover:underline">
                <Mail aria-hidden className="size-4" /> Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
