import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export const controlClasses =
  "w-full rounded-md border border-line bg-white text-[15px] text-ink outline-none transition placeholder:text-subtle/70 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-invalid:border-danger aria-invalid:focus:ring-danger/15 disabled:bg-cream disabled:opacity-70";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[10px] font-semibold tracking-[0.16em] text-subtle uppercase">
        {label}
        {optional && <span className="ml-1 font-normal normal-case tracking-normal text-subtle/80">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-subtle">{hint}</p>
      )}
    </div>
  );
}

export function Input({ className, icon: IconComp, ...props }: ComponentProps<"input"> & { icon?: LucideIcon }) {
  if (!IconComp) return <input className={cn(controlClasses, "h-11 px-3.5", className)} {...props} />;
  return (
    <div className="relative">
      <IconComp aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle/70" />
      <input className={cn(controlClasses, "h-11 pr-3.5 pl-9", className)} {...props} />
    </div>
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(controlClasses, "h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9 pl-3.5", className)} style={{ backgroundImage: CHEVRON }} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClasses, "min-h-28 px-3.5 py-3", className)} {...props} />;
}

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
