import { StarRating } from "@/components/ui/StarRating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, testimonialsIntro } from "@/data/mockData";

/** Centered heading + three quote cards; becomes a snap-scroll row on mobile. */
export function Testimonials() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="container-page">
        <SectionHeading eyebrow={testimonialsIntro.eyebrow} title={testimonialsIntro.title} align="center" />
        <ul className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {testimonials.map((t) => (
            <li key={t.id} className="w-[85%] shrink-0 snap-center sm:w-[60%] md:w-auto">
              <figure className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
                <StarRating rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4 text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="ml-2 text-subtle">
                    {t.role} · {t.location}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
