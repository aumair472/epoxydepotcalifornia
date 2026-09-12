"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = "sm", label = "Quantity", className }: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (raw: string) => {
    const n = Number.parseInt(raw, 10);
    onChange(Number.isFinite(n) ? clamp(n) : value);
  };
  const box = size === "md" ? "h-12" : "h-9";
  const btn = size === "md" ? "w-11" : "w-8";

  return (
    <div className={cn("inline-flex items-stretch overflow-hidden rounded-md border border-line bg-white", box, className)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={cn("grid place-items-center text-muted transition hover:bg-cream hover:text-ink disabled:opacity-40", btn)}
      >
        <Minus className="size-3.5" />
      </button>
      {/* Keyed on value so the field resets whenever the quantity changes elsewhere. */}
      <input
        key={value}
        type="text"
        inputMode="numeric"
        aria-label={label}
        defaultValue={value}
        onBlur={(e) => commit(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(e.currentTarget.value);
        }}
        className={cn("w-10 border-x border-line text-center text-sm font-semibold text-ink outline-none focus:bg-cream", size === "md" && "w-12 text-base")}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={cn("grid place-items-center text-muted transition hover:bg-cream hover:text-ink disabled:opacity-40", btn)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
