"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Phone, Search } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useUI } from "@/context/UIContext";
import { categories, primaryNav, siteConfig, utilityNav } from "@/data/mockData";
import { useHotkey } from "@/hooks/useHotkey";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { openSearch, requestCall, openMobileMenu } = useUI();

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
            <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Phone aria-hidden className="size-3.5" />
              {siteConfig.phone}
            </a>
            <a href={siteConfig.emailHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Mail aria-hidden className="size-3.5" />
              {siteConfig.email}
            </a>
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

          <Logo className="mr-auto lg:mr-0" />

          <button
            type="button"
            onClick={() => openSearch()}
            className="group hidden h-12 min-w-0 flex-1 items-center gap-3 rounded-md border border-line bg-white pr-1.5 pl-4 text-left text-sm text-subtle transition hover:border-subtle/50 lg:ml-10 lg:flex"
            aria-label="Search products"
          >
            <Search aria-hidden className="size-4 shrink-0" />
            <span className="flex-1 truncate">Search products: epoxy, polyaspartic, flakes, tools…</span>
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle xl:inline">⌘K</kbd>
            <span className="rounded bg-brand px-3 py-2 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase transition group-hover:bg-brand-dark">
              Search
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openSearch()}
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-md text-ink hover:bg-cream lg:hidden"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => requestCall()}
              aria-label={`Call to order: ${siteConfig.phone}`}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark md:h-11 md:px-4"
            >
              <Phone aria-hidden className="size-4" />
              <span className="sm:hidden">Call</span>
              <span className="hidden tabular-nums sm:inline">{siteConfig.phone}</span>
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
                "text-[12px] font-medium tracking-[0.14em] uppercase transition hover:text-brand",
                isActive(pathname, l.href) ? "text-brand" : "text-ink"
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
