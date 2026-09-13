"use client";

import Link from "next/link";
import { ChevronRight, Mail, Phone, Search, X } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { useUI } from "@/context/UIContext";
import { categories, primaryNav, siteConfig, utilityNav } from "@/data/mockData";

export function MobileMenu() {
  const { mobileMenuOpen, closeOverlay, openSearch, requestCall } = useUI();

  return (
    <Drawer open={mobileMenuOpen} onClose={closeOverlay} label="Menu" side="left">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <Link href="/" onClick={closeOverlay} className="flex items-center gap-2" aria-label={`${siteConfig.name} — home`}>
          <LogoMark className="h-8" />
          <span className="font-display text-sm font-bold tracking-[0.14em] uppercase">{siteConfig.wordmarkTop}</span>
        </Link>
        <button type="button" onClick={closeOverlay} aria-label="Close menu" className="grid size-9 place-items-center rounded-md hover:bg-cream">
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <button
            type="button"
            onClick={() => openSearch()}
            className="flex h-11 w-full items-center gap-2 rounded-md border border-line px-3 text-left text-sm text-subtle"
          >
            <Search aria-hidden className="size-4" /> Search products…
          </button>
        </div>

        <nav aria-label="Mobile primary" className="border-y border-line">
          {primaryNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeOverlay}
              className="flex items-center justify-between border-b border-line px-4 py-3.5 text-[13px] font-semibold tracking-[0.12em] uppercase last:border-b-0 hover:bg-cream"
            >
              {l.label}
              <ChevronRight aria-hidden className="size-4 text-subtle" />
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-6 pb-2">
          <p className="eyebrow">Shop by category</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 px-4">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/shop/${c.slug}`}
                onClick={closeOverlay}
                className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-[13px] font-medium hover:border-brand hover:text-brand"
              >
                <Icon name={c.icon} className="size-4 text-brand" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1 px-4">
          {utilityNav.map((l) => (
            <Link key={l.label} href={l.href} onClick={closeOverlay} className="block py-1.5 text-sm text-muted hover:text-brand">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="m-4 space-y-2 rounded-lg bg-cream p-4 text-sm">
          <a href={siteConfig.phoneHref} className="flex items-center gap-2 font-medium">
            <Phone aria-hidden className="size-4 text-brand" /> {siteConfig.phone}
          </a>
          <a href={siteConfig.emailHref} className="flex items-center gap-2 text-muted">
            <Mail aria-hidden className="size-4 text-brand" /> {siteConfig.email}
          </a>
          <p className="text-xs text-subtle">{siteConfig.hours}</p>
        </div>
      </div>

      <div className="border-t border-line p-4">
        <button
          type="button"
          onClick={() => requestCall()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-white"
        >
          <Phone aria-hidden className="size-4" /> Call to order
        </button>
      </div>
    </Drawer>
  );
}
