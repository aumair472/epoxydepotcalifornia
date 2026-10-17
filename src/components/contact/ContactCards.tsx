import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/mockData";
import { cn } from "@/lib/cn";
import { mailtoHref } from "@/lib/contact";

interface ContactCardsProps {
  /** Prefills the email's subject line. */
  emailSubject?: string;
  emailBody?: string;
  /** Show the address and hours cards as well as call and email. */
  showVisit?: boolean;
  className?: string;
}

const card = "flex items-start gap-4 rounded-lg border border-line bg-white p-5";
const label = "block text-[10.5px] font-semibold tracking-[0.16em] text-subtle uppercase";

/** The two ways to reach us (call and email), plus the warehouse address and hours. */
export function ContactCards({ emailSubject, emailBody, showVisit = true, className }: ContactCardsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <a href={siteConfig.phoneHref} className={cn(card, "transition hover:border-brand/50")}>
        <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
        <span>
          <span className={label}>Call</span>
          <span className="mt-1 block font-display text-lg font-semibold text-ink">{siteConfig.phone}</span>
          <span className="mt-1 block text-xs text-subtle">Orders, quotes and tech help</span>
        </span>
      </a>
      <a href={mailtoHref(emailSubject, emailBody)} className={cn(card, "transition hover:border-brand/50")}>
        <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
        <span className="min-w-0">
          <span className={label}>Email</span>
          <span className="mt-1 block font-display text-lg font-semibold break-all text-ink">{siteConfig.email}</span>
          <span className="mt-1 block text-xs text-subtle">We reply within one business day</span>
        </span>
      </a>
      {showVisit && (
        <>
          <a href={siteConfig.mapsHref} target="_blank" rel="noopener noreferrer" className={cn(card, "transition hover:border-brand/50")}>
            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
            <span>
              <span className={label}>Warehouse & will-call</span>
              <span className="mt-1 block text-sm font-semibold text-ink">{siteConfig.address.street}</span>
              <span className="block text-sm text-ink">
                {siteConfig.address.city}, {siteConfig.address.region} {siteConfig.address.postalCode}
              </span>
              <span className="mt-1 block text-xs text-subtle">Open in Google Maps</span>
            </span>
          </a>
          <div className={card}>
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
            <span>
              <span className={label}>Hours</span>
              <span className="mt-1 block text-sm font-semibold text-ink">{siteConfig.hours}</span>
              <span className="mt-1 block text-xs text-subtle">Call ahead and we&apos;ll have your order staged at the counter</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
