"use client";

import { Clock, Copy, Mail, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { buttonClasses, Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/data/mockData";

/** Desktop fallback for every buy action: we take orders by phone. */
export function CallToOrderModal() {
  const { callOpen, callSubject, closeOverlay } = useUI();
  const { toast } = useToast();

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.phone);
      toast({ title: "Number copied", description: siteConfig.phone });
    } catch {
      toast({ title: "Couldn't copy", description: `Dial ${siteConfig.phone}`, tone: "error" });
    }
  };

  return (
    <Modal
      open={callOpen}
      onClose={closeOverlay}
      title="Call to order"
      description="Our team takes every order by phone — real people, real product advice."
      size="sm"
    >
      <div className="px-6 py-5">
        {callSubject && (
          <div className="rounded-lg border border-line bg-cream p-4">
            <p className="eyebrow">Mention when you call</p>
            <p className="mt-1.5 font-semibold text-ink">{callSubject.title}</p>
            {callSubject.detail && <p className="mt-0.5 font-mono text-xs text-muted">{callSubject.detail}</p>}
          </div>
        )}

        <a
          href={siteConfig.phoneHref}
          className="mt-5 block text-center font-display text-3xl font-bold tracking-tight text-ink transition hover:text-brand"
        >
          {siteConfig.phone}
        </a>
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-subtle">
          <Clock aria-hidden className="size-3.5" /> {siteConfig.hours}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a href={siteConfig.phoneHref} className={buttonClasses({ size: "md", block: true })}>
            <Phone aria-hidden className="size-4" /> Call now
          </a>
          <Button variant="outline" size="md" block onClick={copyNumber}>
            <Copy aria-hidden className="size-4" /> Copy number
          </Button>
        </div>
        <a
          href={siteConfig.emailHref}
          className="mt-4 flex items-center justify-center gap-1.5 text-[13px] font-medium text-brand-deep hover:underline"
        >
          <Mail aria-hidden className="size-4" /> Prefer email? {siteConfig.email}
        </a>
      </div>
    </Modal>
  );
}
