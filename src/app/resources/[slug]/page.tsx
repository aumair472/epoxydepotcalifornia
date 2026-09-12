import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { articles } from "@/data/mockData";
import { getArticle } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      <header className="bg-cream">
        <div className="container-page max-w-4xl pt-8 pb-10 md:pb-14">
          <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: "Guides", href: "/resources#guides" }, { label: article.tag }]} />
          <p className="eyebrow mt-8">{article.tag}</p>
          <h1 className="mt-3 font-display text-[34px] leading-[1.1] font-bold text-ink md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
          <p className="mt-6 text-sm text-subtle">
            By {article.author} · {formatDate(article.date)} · {article.readMins} min read
          </p>
        </div>
      </header>

      <div className="container-page max-w-5xl">
        <div className="relative -mt-2 aspect-[16/8] overflow-hidden rounded-xl bg-charcoal">
          <Image src={article.image} alt="" fill preload sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="container-page max-w-3xl py-12 md:py-16">
        {article.body.map((section, i) => (
          <section key={i} className="mb-8">
            {section.heading && <h2 className="mb-3 font-display text-2xl font-semibold text-ink">{section.heading}</h2>}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mb-4 text-[17px] leading-[1.75] text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-12 flex flex-col items-start gap-4 rounded-xl bg-charcoal p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <p className="font-display text-xl font-semibold">Ready to put this into practice?</p>
            <p className="mt-1 text-sm text-white/65">Shop the systems our crews use, or ask a tech rep to spec your job.</p>
          </div>
          <ButtonLink href="/shop" className="shrink-0">
            Shop products <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>

      <section className="border-t border-line bg-white py-16">
        <div className="container-page">
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">More from the workshop</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
