import type { Metadata } from "next";
import { ContactCards } from "@/components/contact/ContactCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/data/mockData";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call ${siteConfig.phone} or email ${siteConfig.email} to order, get a quote, book an install estimate or talk to a tech rep. Will-call in Bakersfield, CA.`,
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPageSchema("ContactPage", "Contact Epoxy Depot California", String(metadata.description), "/contact")} />
      <PageHeader
        eyebrow="Contact"
        breadcrumbs={[{ label: "Contact" }]}
        title="Talk to a real person."
        body="Call or email us to place an order, get a quote or an install estimate, or ask a tech rep about a system. Tech reps who've actually rolled the product, a sales team that knows contractor pricing, and a warehouse crew that ships fast."
      />
      <div className="container-page py-12 md:py-16">
        <ContactCards emailSubject="Question for Epoxy Depot" className="max-w-4xl" />
      </div>
    </>
  );
}
