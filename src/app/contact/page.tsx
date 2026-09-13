import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { contactTopics, siteConfig, type ContactTopic } from "@/data/mockData";

export const metadata: Metadata = {
  title: "Contact Us & Install Estimates",
  description: "Talk to a tech rep, request an install estimate, get a quote or check on an order.",
};

const locations = [
  { city: "Ontario (Inland Empire)", note: "HQ, will-call & training bay" },
  { city: "Sacramento", note: "Will-call · Northern California" },
  { city: "San Diego", note: "Will-call · San Diego County" },
];

function isTopic(value: unknown): value is ContactTopic {
  return typeof value === "string" && contactTopics.some((t) => t.value === value);
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const topic = isTopic(sp.topic) ? sp.topic : "general";
  const sku = typeof sp.sku === "string" ? sp.sku : undefined;

  return (
    <>
      <PageHeader
        eyebrow={topic === "install" ? "Have us install" : "Contact"}
        title={topic === "install" ? "Get an install estimate" : "Talk to a real person."}
        body={
          topic === "install"
            ? "Our crews install garages, basements, showrooms and commercial floors across California. Tell us about the space and we'll follow up with a ballpark and a site visit."
            : "Tech reps who've actually rolled the product, a sales team that knows contractor pricing, and a warehouse crew that ships fast."
        }
      />
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
        <div className="space-y-4">
          <a href={siteConfig.phoneHref} className="flex items-start gap-4 rounded-lg border border-line bg-white p-5 transition hover:border-brand/50">
            <Phone aria-hidden className="mt-0.5 size-5 text-brand" />
            <span>
              <span className="block text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">Call</span>
              <span className="mt-1 block font-display text-lg font-semibold text-ink">{siteConfig.phone}</span>
            </span>
          </a>
          <a href={siteConfig.emailHref} className="flex items-start gap-4 rounded-lg border border-line bg-white p-5 transition hover:border-brand/50">
            <Mail aria-hidden className="mt-0.5 size-5 text-brand" />
            <span>
              <span className="block text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">Email</span>
              <span className="mt-1 block font-display text-lg font-semibold break-all text-ink">{siteConfig.email}</span>
            </span>
          </a>
          <div className="flex items-start gap-4 rounded-lg border border-line bg-white p-5">
            <Clock aria-hidden className="mt-0.5 size-5 text-brand" />
            <span>
              <span className="block text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">Hours</span>
              <span className="mt-1 block text-sm text-ink">{siteConfig.hours}</span>
              <span className="block text-xs text-subtle">Call us — the button in the corner of any page dials us directly</span>
            </span>
          </div>
          <div className="rounded-lg border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase">
              <MapPin aria-hidden className="size-4 text-brand" /> Will-call locations
            </p>
            <ul className="mt-3 space-y-2.5">
              {locations.map((l) => (
                <li key={l.city} className="text-sm">
                  <span className="font-semibold text-ink">{l.city}</span>
                  <span className="block text-xs text-subtle">{l.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-start gap-2 px-1 text-xs text-subtle">
            <MessageCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            Contact details and addresses on this demo site are placeholders.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_48px_-32px_rgba(24,24,27,0.35)] lg:self-start">
          <ContactForm defaultTopic={topic} sku={sku} />
        </div>
      </div>
    </>
  );
}
