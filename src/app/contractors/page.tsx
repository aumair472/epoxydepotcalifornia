import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { ContactCards } from "@/components/contact/ContactCards";
import { GoogleRatingBadge } from "@/components/layout/GoogleRatingBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { contractorProgram, siteConfig } from "@/data/mockData";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contractor Account — 15% Off Floor Coatings",
  description: "Apply for a contractor account by phone or email: automatic 15% off, net-30 terms, pallet pricing, will-call and a dedicated tech rep.",
};

const applicationEmail = [
  "Company name:",
  "Contractor license #:",
  "Contact name:",
  "Phone:",
  "Business address:",
  "Trade (epoxy, concrete, flooring, general…):",
  "Estimated monthly volume:",
  "Website (optional):",
].join("\n");

const applySteps = [
  "Call or email us with your company name and contractor license number.",
  "We verify your license, usually within one business day.",
  "Your discount applies to every phone order from then on.",
];

export default function ContractorsPage() {
  return (
    <div className="bg-cream">
      <JsonLd data={webPageSchema("WebPage", "Contractor Account", String(metadata.description), "/contractors")} />
      <div className="container-page pt-8">
        <Breadcrumbs items={[{ label: "Contractor Account" }]} />
      </div>
      <div className="container-page grid gap-10 pt-8 pb-12 md:pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <GoogleRatingBadge className="mb-5 flex w-fit" />
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
              Tip: once you’re approved, just mention your company name when you call — your discount is applied to every phone order.
            </span>
          </p>

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
          <div className="rounded-xl border border-line bg-white px-6 py-6 shadow-[0_24px_48px_-32px_rgba(24,24,27,0.35)] md:px-7">
            <h2 className="font-display text-xl font-semibold">How to apply</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              {applySteps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-charcoal text-[11px] font-bold text-gold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <ContactCards
              showVisit={false}
              emailSubject="Contractor account application"
              emailBody={applicationEmail}
              className="mt-6 sm:grid-cols-1"
            />
            <p className="mt-4 text-xs leading-relaxed text-subtle">The discount applies only after your license is verified.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
