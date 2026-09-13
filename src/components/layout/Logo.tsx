import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/mockData";
import { cn } from "@/lib/cn";

/** Client's real brand logo (downloaded from the live storefront), light-tone variant inverts via CSS filter. */
export function LogoMark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("relative block h-9 w-9", className)}>
      <Image
        src="/logo.png"
        alt=""
        fill
        sizes="36px"
        className={cn("object-contain", tone === "light" && "brightness-0 invert")}
      />
    </span>
  );
}

/** Monogram + wordmark. The tagline line hides on phones so the header never overflows. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={cn("flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5", className)} aria-label={`${siteConfig.name} — home`}>
      <LogoMark tone={tone} className="h-8 sm:h-9" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[13px] font-bold tracking-[0.12em] whitespace-nowrap uppercase sm:text-[15px] sm:tracking-[0.16em]",
            tone === "dark" ? "text-ink" : "text-white"
          )}
        >
          {siteConfig.wordmarkTop}
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[8.5px] font-medium tracking-[0.2em] whitespace-nowrap uppercase sm:block",
            tone === "dark" ? "text-subtle" : "text-white/55"
          )}
        >
          {siteConfig.wordmarkBottom}
        </span>
      </span>
    </Link>
  );
}
