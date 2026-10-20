"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Phone, Search } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useUI } from "@/context/UIContext";
import { categories, primaryNav, utilityNav } from "@/data/mockData";
import { useHotkey } from "@/hooks/useHotkey";
import { useContactDetails } from "@/hooks/useContactDetails";
import { MASKED_PHONE } from "@/lib/contact";
import { PhoneLink } from "@/components/contact/PhoneLink";
import { EmailLink } from "@/components/contact/EmailLink";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { openSearch, requestCall, openMobileMenu } = useUI();
  const contact = useContactDetails();

  useHotkey("k", (e) => {
    e.preventDefault();
    openSearch();
  }, { mod: true });
  useHotkey("/", (e) => {
    e.preventDefault();
    openSearch();
  });

  return (
    <header className="sticky top-0 z-40 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Utility row */}
      <div className="hidden bg-charcoal text-[11.5px] text-white/75 md:block">
        <div className="container-page flex h-8 items-center justify-between">
          <div className="flex items-center gap-6">
            <PhoneLink className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Phone aria-hidden className="size-3.5" />
            </PhoneLink>
            <EmailLink className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Mail aria-hidden className="size-3.5" />
            </EmailLink>
          </div>
          <nav aria-label="Utility" className="flex items-center gap-6">
            {utilityNav.map((l) => (
              <Link key={l.label} href={l.href} className={cn("transition", l.highlight ? "text-gold hover:text-[#e8b95a]" : "hover:text-white")}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center gap-3 md:h-20 md:gap-6">
          <button
            type="button"
            onClick={openMobileMenu}
            aria-label="Open menu"
            className="-ml-2 grid size-10 place-items-center rounded-md text-ink hover:bg-cream lg:hidden"
          >
            <Menu className="size-6" />
          </button>

          <Logo className="mr-auto" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openSearch()}
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-md text-ink hover:bg-cream md:size-11"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => requestCall()}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-deep px-3 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-brand-ink md:h-11 md:px-4"
            >
              <Phone aria-hidden className="size-4" />
              <span className="sm:hidden">Call</span>
              <span className="hidden tabular-nums sm:inline">{contact?.phone ?? MASKED_PHONE}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav aria-label="Primary" className="hidden border-b border-line bg-white lg:block">
        <div className="container-page flex h-10 items-center gap-9">
          {primaryNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className={cn(
                "text-[12px] font-medium tracking-[0.14em] uppercase transition hover:text-brand-deep",
                isActive(pathname, l.href) ? "text-brand-deep" : "text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Category nav */}
      <nav aria-label="Product categories" className="hidden bg-charcoal lg:block">
        <div className="container-page scrollbar-none flex h-10 items-center justify-between gap-4 overflow-x-auto xl:gap-6">
          {categories.map((c) => {
            const active = pathname === `/shop/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[11px] font-bold tracking-[0.1em] whitespace-nowrap uppercase transition hover:text-brand xl:tracking-[0.16em]",
                  active ? "text-brand" : "text-white/90"
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
