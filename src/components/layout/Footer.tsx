import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SocialIcon } from "@/components/layout/SocialIcons";
import { footerColumns, legalLinks, siteConfig } from "@/data/mockData";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(4,1fr)] md:gap-8">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-6 text-sm leading-relaxed text-white/65">
            A California warehouse for epoxy, polyaspartic and urethane systems — built for contractors, designers and serious DIY pros.
          </p>
          <ul className="mt-6 flex gap-2">
            {siteConfig.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-md border border-white/15 text-white/70 transition hover:border-brand hover:text-brand"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-4 md:gap-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/80 transition hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {YEAR} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            ))}
            <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Phone aria-hidden className="size-3.5" /> {siteConfig.phone}
            </a>
            <a href={siteConfig.emailHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Mail aria-hidden className="size-3.5" /> {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
