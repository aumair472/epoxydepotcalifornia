"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Clock, MapPin, MonitorPlay, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { trainingClasses } from "@/data/mockData";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import type { ClassLevel, TrainingClass } from "@/types";

type FormatFilter = "All" | TrainingClass["format"];

const levelStyles: Record<ClassLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-brand/10 text-brand-deep",
  Advanced: "bg-charcoal text-gold",
  "All levels": "bg-cream-2 text-muted",
};

const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

export function TrainingSchedule() {
  const [format, setFormat] = useState<FormatFilter>("All");
  const { requestCall } = useUI();
  const classes = [...trainingClasses]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .filter((c) => format === "All" || c.format === format);

  return (
    <>
      <div role="group" aria-label="Class format" className="flex flex-wrap gap-2">
        {(["All", "In-person", "Virtual"] as FormatFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={format === f}
            onClick={() => setFormat(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[13px] font-medium transition",
              format === f ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-ink hover:border-ink"
            )}
          >
            {f === "All" ? "All classes" : f}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {classes.map((c) => (
          <li key={c.id}>
            <ClassCard trainingClass={c} onBook={() => requestCall({ title: c.title, detail: `${formatDate(c.startDate)} · ${c.format} · ${c.seatsLeft === 0 ? "Waitlist" : "Reserve a seat"}` })} />
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl bg-charcoal p-6 text-white md:flex-row md:items-center md:p-8">
        <div>
          <p className="eyebrow text-gold">Private & crew training</p>
          <p className="mt-2 font-display text-2xl font-semibold">Train your whole crew on your schedule</p>
          <p className="mt-1 max-w-xl text-sm text-white/65">
            Private sessions at our training bay or on your job site — built around the systems you install.
          </p>
        </div>
        <Button onClick={() => requestCall({ title: "Private & crew training", detail: "Tell us your crew size and the systems you install" })} className="shrink-0">
          Request private training
        </Button>
      </div>
    </>
  );
}

function ClassCard({ trainingClass: c, onBook }: { trainingClass: TrainingClass; onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const start = new Date(`${c.startDate}T00:00:00Z`);
  const full = c.seatsLeft === 0;
  const pctTaken = Math.round(((c.seatsTotal - c.seatsLeft) / c.seatsTotal) * 100);

  return (
    <article id={c.id} className="scroll-mt-56 overflow-hidden rounded-xl border border-line bg-white transition target:border-brand target:ring-4 target:ring-brand/15">
      <div className="grid md:grid-cols-[120px_1fr_240px]">
        <div className="flex items-center gap-4 border-b border-line bg-cream px-5 py-4 md:flex-col md:justify-center md:gap-0 md:border-r md:border-b-0 md:py-6">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand uppercase">{month.format(start)}</p>
          <p className="font-display text-4xl leading-none font-bold text-ink">{start.getUTCDate()}</p>
          {c.endDate && <p className="text-xs text-subtle md:mt-1">– {new Date(`${c.endDate}T00:00:00Z`).getUTCDate()}</p>}
          <p className="text-xs text-subtle md:mt-2">{start.getUTCFullYear()}</p>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded px-2 py-1 text-[10px] font-bold tracking-[0.12em] uppercase", levelStyles[c.level])}>{c.level}</span>
            <span className="inline-flex items-center gap-1 rounded bg-cream px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
              {c.format === "Virtual" && <MonitorPlay aria-hidden className="size-3" />}
              {c.format}
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold text-ink">{c.title}</h3>
          <p className="mt-1 text-sm text-muted">{c.description}</p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" /> {c.city} · {c.venue}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" /> {c.schedule} · {c.duration}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={`${c.id}-agenda`}
            className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase"
          >
            What you&apos;ll learn <ChevronDown aria-hidden className={cn("size-3.5 transition", open && "rotate-180")} />
          </button>
          <div id={`${c.id}-agenda`} hidden={!open} className="mt-3">
            <ul className="grid gap-2 sm:grid-cols-2">
              {c.agenda.map((item, i) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-charcoal text-[10px] font-bold text-gold">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-subtle">Best for: {c.audience}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line p-5 md:border-t-0 md:border-l md:p-6">
          <div className="relative hidden aspect-[16/9] overflow-hidden rounded-md bg-charcoal md:block">
            <Image src={c.image} alt="" fill sizes="240px" className="object-cover" />
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="font-display text-2xl font-bold text-ink">{c.price === 0 ? "Free" : formatPrice(c.price)}</p>
            <p className={cn("inline-flex items-center gap-1 text-xs font-medium", full ? "text-danger" : c.seatsLeft <= 3 ? "text-brand-deep" : "text-subtle")}>
              <Users aria-hidden className="size-3.5" />
              {full ? "Class full" : `${c.seatsLeft} of ${c.seatsTotal} seats left`}
            </p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
            <div className={cn("h-full rounded-full", full ? "bg-danger" : "bg-brand")} style={{ width: `${pctTaken}%` }} />
          </div>
          <Button onClick={onBook} variant={full ? "outline" : "primary"} block>
            {full ? "Join waitlist" : c.price === 0 ? "Register free" : "Reserve seat"}
          </Button>
        </div>
      </div>
    </article>
  );
}
