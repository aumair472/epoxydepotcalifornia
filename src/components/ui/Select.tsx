import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const controlClasses =
  "w-full rounded-md border border-line bg-white text-[15px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:bg-cream disabled:opacity-70";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(controlClasses, "h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9 pl-3.5", className)} style={{ backgroundImage: CHEVRON }} {...props}>
      {children}
    </select>
  );
}

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
