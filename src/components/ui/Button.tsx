import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "dark" | "ghost" | "soft" | "outline-light" | "white";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-bold uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-dark",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
  dark: "bg-charcoal text-white hover:bg-charcoal-2",
  ghost: "text-brand hover:text-brand-dark",
  soft: "bg-brand/10 text-brand-deep hover:bg-brand/15",
  "outline-light": "border border-white/25 text-white hover:bg-white/10",
  white: "bg-white text-ink hover:bg-cream",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-[10px]",
  sm: "h-9 px-3.5 text-[11px]",
  md: "h-11 px-5 text-[11px]",
  lg: "h-[52px] px-7 text-xs",
};

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export function buttonClasses({ variant = "primary", size = "md", block }: StyleProps = {}, className?: string) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], variant === "ghost" && "text-[11px]", block && "w-full", className);
}

export function Button({ variant, size, block, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses({ variant, size, block }, className)} {...props} />;
}

export function ButtonLink({ variant, size, block, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size, block }, className)} {...props} />;
}
