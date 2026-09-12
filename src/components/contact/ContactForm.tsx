"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Mail, MapPin, Phone, Ruler, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { contactTopics, type ContactTopic } from "@/data/mockData";
import { makeReference } from "@/lib/format";
import { field, focusFirstError, isEmail, isZip, type FieldErrors } from "@/lib/validation";

export function ContactForm({ defaultTopic = "general", sku }: { defaultTopic?: ContactTopic; sku?: string }) {
  const { toast } = useToast();
  const [topic, setTopic] = useState<ContactTopic>(defaultTopic);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ reference: string; name: string } | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: FieldErrors = {};
    if (!field(data, "name")) next.name = "Enter your name.";
    if (!isEmail(field(data, "email"))) next.email = "Enter a valid email address.";
    if (topic === "install") {
      if (!isZip(field(data, "zip"))) next.zip = "Enter a 5-digit zip code.";
      if (!(Number(field(data, "sqft")) > 0)) next.sqft = "Enter the approximate square footage.";
    }
    if (topic === "order" && !field(data, "order")) next.order = "Enter your order number.";
    if (field(data, "message").length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(form, next);
      return;
    }
    setPending(true);
    window.setTimeout(() => {
      const reference = makeReference(topic === "install" ? "EST" : "MSG");
      setDone({ reference, name: field(data, "name").split(" ")[0] });
      setPending(false);
      toast({
        title: topic === "install" ? "Estimate request sent" : "Message sent",
        description: `Ref ${reference} — we reply within one business day.`,
      });
    }, 800);
  };

  if (done) {
    return (
      <div ref={successRef} className="scroll-mt-56 px-6 py-12 text-center md:px-8" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold">Thanks, {done.name}!</h2>
        <p className="mt-2 text-sm text-muted">
          {topic === "install"
            ? "An estimator will call to confirm details and schedule a site visit."
            : "A member of our team will get back to you within one business day."}
        </p>
        <p className="mt-4 inline-block rounded-md bg-cream px-3 py-1.5 font-mono text-xs tracking-wider text-muted">Ref {done.reference}</p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => setDone(null)}>
            Send another message
          </Button>
        </div>
        <p className="mt-4 text-xs text-subtle">Demo: nothing was sent — this confirmation is simulated.</p>
      </div>
    );
  }

  const invalid = (name: string) => ({ "aria-invalid": Boolean(errors[name]) });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 px-6 py-6 sm:grid-cols-2 md:px-7">
      <Field label="What can we help with?" htmlFor="ct-topic" className="sm:col-span-2">
        <Select id="ct-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value as ContactTopic)}>
          {contactTopics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Name" htmlFor="ct-name" error={errors.name}>
        <Input id="ct-name" name="name" icon={User} autoComplete="name" {...invalid("name")} />
      </Field>
      <Field label="Email" htmlFor="ct-email" error={errors.email}>
        <Input id="ct-email" name="email" type="email" icon={Mail} autoComplete="email" {...invalid("email")} />
      </Field>
      <Field label="Phone" htmlFor="ct-phone" optional className={topic === "install" ? undefined : "sm:col-span-2"}>
        <Input id="ct-phone" name="phone" type="tel" icon={Phone} autoComplete="tel" />
      </Field>
      {topic === "install" && (
        <>
          <Field label="Project zip code" htmlFor="ct-zip" error={errors.zip}>
            <Input id="ct-zip" name="zip" inputMode="numeric" icon={MapPin} autoComplete="postal-code" {...invalid("zip")} />
          </Field>
          <Field label="Approx. square feet" htmlFor="ct-sqft" error={errors.sqft}>
            <Input id="ct-sqft" name="sqft" inputMode="numeric" icon={Ruler} placeholder="e.g. 450" {...invalid("sqft")} />
          </Field>
          <Field label="Space type" htmlFor="ct-space">
            <Select id="ct-space" name="space" defaultValue="Garage">
              <option>Garage</option>
              <option>Basement</option>
              <option>Patio / pool deck</option>
              <option>Showroom / retail</option>
              <option>Warehouse / industrial</option>
            </Select>
          </Field>
        </>
      )}
      {topic === "quote" && (
        <Field label="SKU(s)" htmlFor="ct-sku" optional className="sm:col-span-2">
          <Input id="ct-sku" name="sku" defaultValue={sku} placeholder="e.g. ED-EP-100-3G × 10" />
        </Field>
      )}
      {topic === "order" && (
        <Field label="Order number" htmlFor="ct-order" error={errors.order} className="sm:col-span-2">
          <Input id="ct-order" name="order" placeholder="ED-12345" {...invalid("order")} />
        </Field>
      )}
      <Field label="Message" htmlFor="ct-message" error={errors.message} className="sm:col-span-2">
        <Textarea
          id="ct-message"
          name="message"
          placeholder={topic === "install" ? "Condition of the slab, the look you want, timing…" : "How can we help?"}
          {...invalid("message")}
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" block size="lg" disabled={pending}>
          {pending ? "Sending…" : topic === "install" ? "Request my estimate" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
