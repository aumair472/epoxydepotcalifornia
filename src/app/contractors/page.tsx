import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { ContractorForm } from "@/components/contractors/ContractorForm";
import { Icon } from "@/components/ui/Icon";
import { StarRating } from "@/components/ui/StarRating";
import { contractorProgram, siteConfig, testimonials } from "@/data/mockData";

export const metadata: Metadata = {
  title: "Contractor Account — 15% Off Floor Coatings",
  description: "Apply for a contractor account: automatic 15% off, net-30 terms, pallet pricing, will-call and a dedicated tech rep.",
};

export default function ContractorsPage() {
  const quote = testimonials[2];
  return (
    <div className="bg-cream">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow">{contractorProgram.eyebrow}</p>
          <h1 className="mt-3 font-display text-[36px] leading-[1.08] font-bold text-ink md:text-5xl">{contractorProgram.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-[17px]">
            Verified contractors get an automatic <strong className="font-semibold text-brand-deep">{siteConfig.contractorDiscount * 100}% discount</strong> on every
            product, net-30 terms after the first three orders, same-day will-call and a dedicated tech rep.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {contractorProgram.perks.map((p) => (
              <li key={p.text} className="flex items-start gap-3 rounded-lg border border-line bg-white p-4 text-sm text-ink">
                <Icon name={p.icon} className="mt-0.5 size-5 shrink-0 text-brand" />
                {p.text}
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-brand/25 bg-brand/10 px-4 py-3 text-sm text-ink">
            <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-deep" />
            <span>
              Tip: create a customer account first — once approved, your discount turns on automatically when you sign in.
            </span>
          </p>

          <figure className="mt-10 rounded-lg border border-line bg-white p-6">
            <StarRating rating={quote.rating} />
            <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">&ldquo;{quote.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-ink">{quote.name}</span>
              <span className="ml-2 text-subtle">
                {quote.role} · {quote.location}
              </span>
            </figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8 text-center">
            {[
              ["15%", "Automatic discount"],
              ["Net-30", "After 3 orders"],
              ["24–48h", "Ship time"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-bold text-ink md:text-3xl">{value}</dd>
                <dd className="mt-1 text-xs text-subtle">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:sticky lg:top-[212px] lg:self-start">
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_48px_-32px_rgba(24,24,27,0.35)]">
            <ContractorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
