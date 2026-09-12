import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white">
      <Link href={`/resources/${article.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden bg-charcoal">
        <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.16em] uppercase">
          <span className="text-brand">{article.tag}</span>
          <span className="text-subtle">
            {formatDate(article.date)} · {article.readMins} min
          </span>
        </p>
        <h3 className="mt-2.5 font-display text-lg leading-snug font-semibold text-ink">
          <Link href={`/resources/${article.slug}`} className="hover:text-brand">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase transition group-hover:gap-2">
          Read article <ArrowRight aria-hidden className="size-3.5" />
        </span>
      </div>
    </article>
  );
}
