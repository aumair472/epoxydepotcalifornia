"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck, Mail } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { newsletterContent } from "@/data/mockData";
import { cn } from "@/lib/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    toast({ title: "You're on the list", description: "Watch your inbox for this week's contractor deals (demo)." });
  };

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-cream px-6 py-10 sm:px-10 md:py-12">
          <div aria-hidden className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,0.14),transparent_65%)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-muted uppercase">
                <Mail aria-hidden className="size-3.5 text-brand" /> {newsletterContent.badge}
              </span>
              <h2 className="mt-4 font-display text-[28px] leading-[1.12] font-bold text-ink md:text-[34px]">{newsletterContent.title}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{newsletterContent.body}</p>
            </div>
            <div>
              {done ? (
                <p className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800" role="status">
                  <CircleCheck aria-hidden className="size-5 shrink-0" />
                  Thanks! <strong className="font-semibold">{email}</strong> is subscribed.
                </p>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className={cn("flex overflow-hidden rounded-md border bg-white", error ? "border-danger" : "border-line focus-within:border-brand")}>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourcompany.com"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "newsletter-error" : undefined}
                      className="h-12 min-w-0 flex-1 px-4 text-[15px] outline-none"
                    />
                    <button type="submit" className="inline-flex items-center gap-2 bg-brand px-5 text-[12px] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-brand-dark">
                      Subscribe <ArrowRight aria-hidden className="size-4" />
                    </button>
                  </div>
                  {error && (
                    <p id="newsletter-error" role="alert" className="mt-2 text-xs font-medium text-danger">
                      {error}
                    </p>
                  )}
                </form>
              )}
              <p className="mt-3 text-xs text-subtle">{newsletterContent.fineprint}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
