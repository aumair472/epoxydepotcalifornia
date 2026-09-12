import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { categories } from "@/data/mockData";

export default function NotFound() {
  return (
    <section className="bg-cream">
      <div className="container-page py-20 text-center md:py-28">
        <p className="font-display text-8xl font-bold text-brand/25 md:text-9xl">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">This page didn&apos;t cure.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you&apos;re looking for has moved or never existed. Try the shop or jump to a category.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">
            Shop all products <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
        <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink hover:border-brand hover:text-brand">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
