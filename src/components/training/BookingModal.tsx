"use client";

import { useState } from "react";
import { CalendarDays, CircleCheck, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { formatDateRange, formatPrice, makeReference } from "@/lib/format";
import { field, focusFirstError, isEmail, isPhone, type FieldErrors } from "@/lib/validation";
import type { TrainingClass } from "@/types";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  /** The class to book; omit for a private / crew training inquiry. */
  trainingClass?: TrainingClass;
}

export function BookingModal({ open, onClose, trainingClass }: BookingModalProps) {
  const waitlist = trainingClass ? trainingClass.seatsLeft === 0 : false;
  const title = !trainingClass ? "Request private crew training" : waitlist ? "Join the waitlist" : "Reserve your seat";
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={
        trainingClass ? (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-ink">{trainingClass.title}</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden className="size-3.5" /> {formatDateRange(trainingClass.startDate, trainingClass.endDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5" /> {trainingClass.city}
            </span>
          </span>
        ) : (
          "We'll build a session around your crew, your systems and your schedule."
        )
      }
      size="md"
    >
      <BookingForm trainingClass={trainingClass} waitlist={waitlist} onClose={onClose} />
    </Modal>
  );
}

function BookingForm({ trainingClass, waitlist, onClose }: { trainingClass?: TrainingClass; waitlist: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ reference: string; seats: number; name: string } | null>(null);
  const maxSeats = trainingClass ? Math.max(1, Math.min(4, trainingClass.seatsLeft || 4)) : 0;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: FieldErrors = {};
    if (!field(data, "name")) next.name = "Enter your name.";
    if (!isEmail(field(data, "email"))) next.email = "Enter a valid email address.";
    if (!isPhone(field(data, "phone"))) next.phone = "Enter a 10-digit phone number.";
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(form, next);
      return;
    }
    setPending(true);
    window.setTimeout(() => {
      const reference = makeReference(trainingClass ? "CLS" : "PVT");
      const seats = Number(field(data, "seats") || 1);
      setDone({ reference, seats, name: field(data, "name").split(" ")[0] });
      setPending(false);
      toast({
        title: !trainingClass ? "Training request sent" : waitlist ? "You're on the waitlist" : "Seat reserved",
        description: trainingClass ? `${trainingClass.title} · Ref ${reference}` : `Ref ${reference} — we'll call within one business day.`,
      });
    }, 800);
  };

  if (done) {
    return (
      <div className="px-6 py-8 text-center" role="status">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-6" />
        </span>
        <p className="mt-4 font-display text-xl font-semibold">
          {!trainingClass ? "Request received" : waitlist ? "You're on the waitlist" : "You're booked!"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {!trainingClass
            ? `Thanks, ${done.name}. A training coordinator will reach out to plan your session.`
            : waitlist
              ? `Thanks, ${done.name}. We'll email you the moment a seat opens up.`
              : `Thanks, ${done.name}. ${done.seats} ${done.seats === 1 ? "seat is" : "seats are"} held for you — confirmation and prep list are on the way.`}
        </p>
        <p className="mt-4 inline-block rounded-md bg-cream px-3 py-1.5 font-mono text-xs tracking-wider text-muted">Ref {done.reference}</p>
        <div className="mt-6">
          <Button onClick={onClose}>Done</Button>
        </div>
        <p className="mt-4 text-xs text-subtle">Demo: no booking was transmitted.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 px-6 py-5 sm:grid-cols-2">
      <Field label="Full name" htmlFor="bk-name" error={errors.name} className="sm:col-span-2">
        <Input id="bk-name" name="name" icon={User} autoComplete="name" data-autofocus aria-invalid={Boolean(errors.name)} />
      </Field>
      <Field label="Email" htmlFor="bk-email" error={errors.email}>
        <Input id="bk-email" name="email" type="email" icon={Mail} autoComplete="email" aria-invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Phone" htmlFor="bk-phone" error={errors.phone}>
        <Input id="bk-phone" name="phone" type="tel" icon={Phone} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
      </Field>
      {trainingClass ? (
        <>
          <Field label="Seats" htmlFor="bk-seats">
            <Select id="bk-seats" name="seats" defaultValue="1">
              {Array.from({ length: maxSeats }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "seat" : "seats"}
                  {trainingClass.price > 0 ? ` · ${formatPrice(trainingClass.price * (i + 1))}` : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Experience" htmlFor="bk-experience">
            <Select id="bk-experience" name="experience" defaultValue="Some coating experience">
              <option>First-timer</option>
              <option>Some coating experience</option>
              <option>Professional installer</option>
            </Select>
          </Field>
        </>
      ) : (
        <>
          <Field label="Crew size" htmlFor="bk-crew">
            <Select id="bk-crew" name="crew" defaultValue="3–5">
              <option>1–2</option>
              <option>3–5</option>
              <option>6–10</option>
              <option>10+</option>
            </Select>
          </Field>
          <Field label="Preferred location" htmlFor="bk-location">
            <Select id="bk-location" name="location" defaultValue="Ontario, CA">
              <option>Ontario, CA</option>
              <option>Sacramento, CA</option>
              <option>San Diego, CA</option>
              <option>On our job site</option>
            </Select>
          </Field>
        </>
      )}
      <Field label="Notes" htmlFor="bk-notes" optional className="sm:col-span-2">
        <Textarea id="bk-notes" name="notes" className="min-h-20" placeholder={trainingClass ? "Anything we should know?" : "Systems you want covered, dates that work…"} />
      </Field>
      <div className="flex items-center justify-between gap-3 sm:col-span-2">
        {trainingClass && trainingClass.price > 0 && !waitlist ? (
          <p className="text-xs text-subtle">Pay at check-in · free cancellation up to 7 days prior</p>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : !trainingClass ? "Send request" : waitlist ? "Join waitlist" : "Reserve seat"}
        </Button>
      </div>
    </form>
  );
}
