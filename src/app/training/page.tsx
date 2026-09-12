import type { Metadata } from "next";
import { Award, HardHat, Users } from "lucide-react";
import { TrainingSchedule } from "@/components/training/TrainingSchedule";
import { PageHeader } from "@/components/ui/PageHeader";
import { trainingIntro } from "@/data/mockData";

export const metadata: Metadata = {
  title: "Epoxy & Floor Coating Training Classes",
  description: "Hands-on epoxy, polyaspartic, metallic and concrete prep classes in Ontario, Sacramento and San Diego — plus free virtual webinars.",
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
      <PageHeader eyebrow={trainingIntro.eyebrow} title={trainingIntro.title} body={trainingIntro.body}>
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

      <section className="container-page py-12 md:py-16">
        <h2 className="sr-only">Class schedule</h2>
        <TrainingSchedule />
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
