"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, RotateCcw, Send, X } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { useUI } from "@/context/UIContext";
import { evaConfig, evaKeywordAnswers, evaSurfaces } from "@/data/mockData";
import { getProductsByIds, getTrainingClass, getUpcomingClasses, searchProducts } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatDateRange, formatPrice } from "@/lib/format";
import type { EvaPersona, NavLink } from "@/types";

interface Message {
  id: number;
  from: "eva" | "user";
  text: string;
  options?: { id: string; label: string }[];
  productIds?: string[];
  classIds?: string[];
  link?: NavLink;
}

type NewMessage = Omit<Message, "id" | "from"> & { from?: Message["from"] };

const INITIAL: Message[] = [
  { id: 1, from: "eva", text: evaConfig.greeting },
  { id: 2, from: "eva", text: evaConfig.intro, options: evaConfig.starterReplies.map((r) => ({ ...r })) },
];

const personaLabels: Record<EvaPersona, string> = {
  diy: "I'm a DIYer",
  install: "I want you to install it",
  contractor: "I'm a contractor",
};

const TEASER_KEY = "edc-eva-teaser";

export function EvaChatWidget() {
  const { chatOpen, openChat, closeChat } = useUI();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [typing, setTyping] = useState(false);
  const [awaitingInstall, setAwaitingInstall] = useState(false);
  const [persona, setPersona] = useState<EvaPersona | null>(null);
  const [draft, setDraft] = useState("");
  const [teaser, setTeaser] = useState(false);
  const nextId = useRef(INITIAL.length + 1);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // One gentle teaser bubble per browser session.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => setTeaser(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, chatOpen]);

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      window.sessionStorage.setItem(TEASER_KEY, "1");
    } catch {}
  };

  const push = (msgs: NewMessage[]) => {
    const withIds = msgs.map((m) => ({ from: "eva" as const, ...m, id: nextId.current++ }));
    setMessages((prev) => [...prev, ...withIds]);
  };

  const reply = (msgs: NewMessage[], delay = 700) => {
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      push(msgs);
    }, delay);
    timers.current.push(t);
  };

  const handleIntent = (intent: string, label?: string) => {
    if (label) push([{ from: "user", text: label }]);

    if (intent.startsWith("surface:")) {
      const surface = evaSurfaces.find((s) => s.id === intent.slice(8));
      if (surface) reply([{ text: surface.reply, productIds: surface.productIds, link: { label: "Browse all products", href: "/shop" } }]);
      return;
    }
    switch (intent) {
      case "diy":
        setPersona("diy");
        reply([{ text: evaConfig.diyPrompt, options: evaSurfaces.map((s) => ({ id: `surface:${s.id}`, label: s.label })) }]);
        break;
      case "install":
        setPersona("install");
        setAwaitingInstall(true);
        reply([{ text: evaConfig.installPrompt }]);
        break;
      case "contractor":
        setPersona("contractor");
        reply([{ text: evaConfig.contractorReply, link: { label: "Apply for a contractor account", href: "/contractors" } }]);
        break;
      case "training":
        reply([
          {
            text: evaConfig.trainingReply,
            classIds: getUpcomingClasses(3).map((c) => c.id),
            link: { label: "Full training schedule", href: "/training" },
          },
        ]);
        break;
    }
  };

  const handleSend = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    push([{ from: "user", text }]);

    if (awaitingInstall) {
      setAwaitingInstall(false);
      reply([{ text: evaConfig.installThanks, link: { label: "Send photos & details", href: "/contact?topic=install" } }], 900);
      return;
    }

    const lower = text.toLowerCase();
    if (lower.includes("garage") || lower.includes("basement")) {
      const surface = evaSurfaces.find((s) => lower.includes(s.id));
      if (surface) {
        reply([{ text: surface.reply, productIds: surface.productIds }]);
        return;
      }
    }

    const answer = evaKeywordAnswers.find((a) => a.keywords.some((k) => lower.includes(k)));
    if (answer) {
      const ids = answer.productQuery ? searchProducts(answer.productQuery).slice(0, 3).map((p) => p.id) : undefined;
      reply([{ text: answer.reply, productIds: ids, link: answer.link }]);
      return;
    }

    const found = searchProducts(text).slice(0, 3);
    if (found.length) {
      reply([
        {
          text: `Here's what I found for “${text}”:`,
          productIds: found.map((p) => p.id),
          link: { label: "See all results", href: `/shop?q=${encodeURIComponent(text)}` },
        },
      ]);
    } else {
      reply([{ text: evaConfig.fallback, link: { label: "Contact a tech rep", href: "/contact" } }]);
    }
  };

  const restart = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setTyping(false);
    setAwaitingInstall(false);
    setPersona(null);
    setMessages(INITIAL);
  };

  const open = () => {
    dismissTeaser();
    openChat();
  };

  return (
    <>
      {!chatOpen && (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
          {teaser && (
            <div className="relative max-w-[240px] animate-slide-up rounded-xl border border-line bg-white p-3 pr-8 text-sm text-ink shadow-lg">
              <button type="button" onClick={open} className="text-left">
                <span className="font-semibold">{evaConfig.name}:</span> {evaConfig.teaser}
              </button>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="Dismiss chat prompt"
                className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded text-subtle hover:bg-cream"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={open}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(249,115,22,0.7)] transition hover:bg-brand-dark"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-white" />
            </span>
            Chat with {evaConfig.name}
          </button>
        </div>
      )}

      {chatOpen && (
        <div
          role="dialog"
          aria-label={`Chat with ${evaConfig.name}`}
          onKeyDown={(e) => e.key === "Escape" && closeChat()}
          className="fixed inset-0 z-[60] flex animate-pop-in flex-col overflow-hidden bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(620px,calc(100vh-48px))] sm:w-[380px] sm:rounded-xl sm:border sm:border-line sm:shadow-2xl"
        >
          <div className="flex items-center gap-3 bg-charcoal px-4 py-3 text-white">
            <span className="grid size-9 place-items-center rounded-full bg-brand font-display text-base font-bold">E</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{evaConfig.name}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/60">
                <span className="size-1.5 rounded-full bg-success" /> {evaConfig.status}
              </p>
            </div>
            <button type="button" onClick={restart} aria-label="Restart conversation" className="grid size-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white">
              <RotateCcw className="size-4" />
            </button>
            <button type="button" onClick={closeChat} aria-label="Close chat" className="grid size-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white">
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="mr-1 text-[11px] text-subtle">I&apos;m a / I want to</span>
            {evaConfig.personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleIntent(p.id, personaLabels[p.id])}
                aria-pressed={persona === p.id}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition",
                  persona === p.id ? "border-brand bg-brand text-white" : "border-line text-ink hover:border-brand hover:text-brand"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-cream/50 px-4 py-4" aria-live="polite">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onOption={handleIntent} onNavigate={closeChat} />
            ))}
            {typing && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-3" aria-label={`${evaConfig.name} is typing`}>
                {[0, 150, 300].map((d) => (
                  <span key={d} className="size-1.5 animate-typing rounded-full bg-subtle" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line bg-white px-3 py-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSend(e);
              }}
              placeholder={awaitingInstall ? "e.g. 450 sq ft, 92501" : "Ask about products, prep, training…"}
              aria-label={`Message ${evaConfig.name}`}
              autoFocus
              className="h-10 flex-1 rounded-full border border-line bg-cream px-4 text-sm outline-none focus:border-brand focus:bg-white"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 text-[12px] font-bold text-white transition hover:bg-brand-dark disabled:opacity-45"
            >
              <Send aria-hidden className="size-3.5" /> Send
            </button>
          </form>
          <p className="border-t border-line bg-white px-4 py-2 text-center text-[10.5px] text-subtle">{evaConfig.disclaimer}</p>
        </div>
      )}
    </>
  );
}

function ChatMessage({ message, onOption, onNavigate }: { message: Message; onOption: (id: string, label: string) => void; onNavigate: () => void }) {
  if (message.from === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-sm text-white">{message.text}</p>
      </div>
    );
  }
  const products = message.productIds ? getProductsByIds(message.productIds) : [];
  const classes = message.classIds?.map((id) => getTrainingClass(id)).filter((c) => c !== undefined) ?? [];

  return (
    <div className="max-w-[92%] space-y-2">
      <p className="w-fit rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink">{message.text}</p>
      {products.length > 0 && (
        <ul className="space-y-1.5">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-2.5 rounded-lg border border-line bg-white p-2">
              <span className="size-11 shrink-0 rounded bg-gradient-to-b from-cream-2 to-white p-0.5">
                <ProductImage product={p} />
              </span>
              <span className="min-w-0 flex-1">
                <Link href={`/product/${p.id}`} onClick={onNavigate} className="block truncate text-[13px] font-semibold text-ink hover:text-brand">
                  {p.name}
                </Link>
                <span className="text-xs text-subtle">
                  {formatPrice(p.price)} · {p.packSize}
                </span>
              </span>
              <AddToCartButton productId={p.id} size="xs" />
            </li>
          ))}
        </ul>
      )}
      {classes.length > 0 && (
        <ul className="space-y-1.5">
          {classes.map((c) => (
            <li key={c.id}>
              <Link href="/training" onClick={onNavigate} className="flex items-center gap-2.5 rounded-lg border border-line bg-white p-2.5 hover:border-brand">
                <CalendarDays aria-hidden className="size-4 shrink-0 text-brand" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ink">{c.title}</span>
                  <span className="text-xs text-subtle">
                    {formatDateRange(c.startDate, c.endDate)} · {c.city} · {c.seatsLeft} seats left
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {message.options && (
        <div className="flex flex-wrap gap-1.5">
          {message.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onOption(o.id, o.label)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {message.link && (
        <Link href={message.link.href} onClick={onNavigate} className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
          {message.link.label} <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
