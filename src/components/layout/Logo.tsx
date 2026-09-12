import Link from "next/link";
import { siteConfig } from "@/data/mockData";
import { cn } from "@/lib/cn";

/** "ED" block monogram with a safety-orange slash, plus the two-line wordmark. */
export function LogoMark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const fill = tone === "dark" ? "#18181B" : "#FFFFFF";
  return (
    <svg viewBox="0 0 48 40" className={cn("h-9 w-auto", className)} aria-hidden>
      {/* E */}
      <path d="M1 4h15v7H8.5v5.5H15v7H8.5V29H16v7H1z" fill={fill} />
      {/* slash */}
      <path d="M22.5 36h-5.2L25 4h5.2z" fill="#F97316" />
      {/* D */}
      <path fillRule="evenodd" d="M29.5 4h6.2C43 4 47 10.6 47 20s-4 16-11.3 16h-6.2zm7 7h-.5v18h.5c3 0 3.9-4.2 3.9-9s-.9-9-3.9-9z" fill={fill} />
    </svg>
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
