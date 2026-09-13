"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Building2, CircleCheck, Globe, IdCard, Mail, MapPin, Phone, User } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { contractorProgram } from "@/data/mockData";
import { makeReference } from "@/lib/format";
import { field, focusFirstError, isEmail, isPhone, type FieldErrors } from "@/lib/validation";

interface Submitted {
  reference: string;
  company: string;
  email: string;
}

export function ContractorForm() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: FieldErrors = {};
    if (!field(data, "company")) next.company = "Company name is required.";
    if (field(data, "license").length < 5) next.license = "Enter your contractor license number.";
    if (!field(data, "contact")) next.contact = "Contact name is required.";
    if (!isPhone(field(data, "phone"))) next.phone = "Enter a 10-digit phone number.";
    if (!isEmail(field(data, "email"))) next.email = "Enter a valid email address.";
    if (!field(data, "address")) next.address = "Business address is required.";
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(form, next);
      return;
    }

    setPending(true);
    window.setTimeout(() => {
      const reference = makeReference("EDC");
      setSubmitted({ reference, company: field(data, "company"), email: field(data, "email") });
      setPending(false);
      toast({
        title: "Application received",
        description: `Reference ${reference} — we reply within one business day.`,
        action: { label: "Keep shopping", href: "/shop" },
      });
    }, 900);
  };

  if (submitted) {
    return (
      <div ref={successRef} className="scroll-mt-56 px-6 py-10 text-center md:px-8" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold">Application received</h2>
        <p className="mt-2 text-sm text-muted">
          Thanks, <strong className="text-ink">{submitted.company}</strong>. We&apos;ll review your license and email{" "}
          <strong className="text-ink">{submitted.email}</strong> within one business day.
        </p>
        <p className="mt-4 inline-block rounded-md bg-cream px-3 py-1.5 font-mono text-xs tracking-wider text-muted">Ref {submitted.reference}</p>
        <ol className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm text-muted">
          {["We verify your contractor license.", "Your account is flagged for contractor pricing.", "15% off applies to every phone order."].map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-charcoal text-[11px] font-bold text-gold">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">Shop the warehouse</ButtonLink>
          <Button variant="outline" onClick={() => setSubmitted(null)}>
            Submit another
          </Button>
        </div>
        <p className="mt-6 text-xs text-subtle">Demo: nothing was sent — this confirmation is simulated.</p>
      </div>
    );
  }

  const err = (name: string) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `ca-${name}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 px-6 py-6 sm:grid-cols-2 md:px-7">
      <div className="sm:col-span-2">
        <h2 className="font-display text-xl font-semibold">Application</h2>
        <p className="text-sm text-subtle">All fields required unless noted.</p>
      </div>
      <Field label="Company name" htmlFor="ca-company" error={errors.company} className="sm:col-span-2">
        <Input id="ca-company" name="company" icon={Building2} autoComplete="organization" {...err("company")} />
      </Field>
      <Field label="Contractor license #" htmlFor="ca-license" error={errors.license}>
        <Input id="ca-license" name="license" icon={IdCard} placeholder="e.g. C-33 1234567" {...err("license")} />
      </Field>
      <Field label="Contact name" htmlFor="ca-contact" error={errors.contact}>
        <Input id="ca-contact" name="contact" icon={User} autoComplete="name" {...err("contact")} />
      </Field>
      <Field label="Phone" htmlFor="ca-phone" error={errors.phone}>
        <Input id="ca-phone" name="phone" type="tel" icon={Phone} autoComplete="tel" {...err("phone")} />
      </Field>
      <Field label="Email" htmlFor="ca-email" error={errors.email}>
        <Input id="ca-email" name="email" type="email" icon={Mail} autoComplete="email" {...err("email")} />
      </Field>
      <Field label="Business address" htmlFor="ca-address" error={errors.address} className="sm:col-span-2">
        <Input id="ca-address" name="address" icon={MapPin} autoComplete="street-address" {...err("address")} />
      </Field>
      <Field label="Trade type" htmlFor="ca-trade">
        <Select id="ca-trade" name="trade" defaultValue={contractorProgram.tradeTypes[0]}>
          {contractorProgram.tradeTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Website" htmlFor="ca-website" optional>
        <Input id="ca-website" name="website" icon={Globe} placeholder="https://" />
      </Field>
      <Field label="Estimated monthly volume" htmlFor="ca-volume" optional className="sm:col-span-2">
        <Select id="ca-volume" name="volume" defaultValue="">
          <option value="">Select a range</option>
          {contractorProgram.volumes.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </Select>
      </Field>
      <Field label="Notes" htmlFor="ca-notes" optional className="sm:col-span-2">
        <Textarea id="ca-notes" name="notes" placeholder="Typical job types, systems you install, territories…" />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" block size="lg" disabled={pending}>
          {pending ? "Submitting…" : "Submit application"}
        </Button>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          By submitting you agree to our{" "}
          <Link href="/info/terms" className="underline hover:text-brand">
            terms
          </Link>
          . We typically reply within one business day. Discount applies only after approval.
        </p>
      </div>
    </form>
  );
}
