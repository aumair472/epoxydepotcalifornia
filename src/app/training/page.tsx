import type { Metadata } from "next";
import { Award, HardHat, Users } from "lucide-react";
import { ContactCards } from "@/components/contact/ContactCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { trainingIntro, trainingTopics } from "@/data/mockData";
import { courseListSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Epoxy & Floor Coating Training Classes",
  description: "Hands-on epoxy, polyaspartic, metallic and concrete prep classes in Bakersfield, CA. Call or email for the next class date.",
};

const faqs = [
  {
    q: "What should I bring?",
    a: "Closed-toe work boots and clothes you don't mind ruining. We supply all product, tools, PPE and practice slabs.",
  },
  {
    q: "Do I need experience?",
    a: "Beginner classes assume none. Intermediate and advanced classes expect you to have mixed and rolled at least a few kits.",
  },
  {
    q: "Is there a certificate?",
    a: "Yes — every in-person class includes a certificate of completion you can share with customers.",
  },
  {
    q: "Can I cancel?",
    a: "Free cancellation up to 7 days before class. After that, your seat converts to credit for a future class.",
  },
];

export default function TrainingPage() {
  return (
    <>
      <JsonLd data={courseListSchema(trainingTopics)} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHeader eyebrow={trainingIntro.eyebrow} title={trainingIntro.title} body={trainingIntro.body} breadcrumbs={[{ label: "Training" }]}>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink">
          <li className="inline-flex items-center gap-2">
            <Users aria-hidden className="size-4 text-brand" /> 6–10 seats per class
          </li>
          <li className="inline-flex items-center gap-2">
            <HardHat aria-hidden className="size-4 text-brand" /> Taught by working installers
          </li>
          <li className="inline-flex items-center gap-2">
            <Award aria-hidden className="size-4 text-brand" /> Certificate of completion
          </li>
        </ul>
      </PageHeader>

      <section className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow">What we teach</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Classes</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {trainingTopics.map((t) => (
              <li key={t.id} className="rounded-lg border border-line bg-white p-5">
                <p className="text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">{t.level}</p>
                <p className="mt-2 font-semibold text-ink">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.summary}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:sticky lg:top-[212px] lg:self-start">
          <div className="rounded-xl border border-line bg-white px-6 py-6 shadow-[0_24px_48px_-32px_rgba(24,24,27,0.35)] md:px-7">
            <h2 className="font-display text-xl font-semibold">Book a seat</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Class dates change with demand. Call or email us and we&apos;ll tell you when the class you want runs next and save you a seat.
            </p>
            <ContactCards
              showVisit={false}
              emailSubject="Training class inquiry"
              emailBody={"Class I'm interested in:\nNumber of people:\nName:\nPhone:\n"}
              className="mt-5 sm:grid-cols-1"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Before you book</h2>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-line bg-cream p-5">
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
