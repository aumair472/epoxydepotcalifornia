import { cn } from "@/lib/cn";
import type { Badge } from "@/types";

const styles: Record<Badge, string> = {
  "Best Seller": "bg-brand text-white",
  New: "bg-ink text-white",
  Pro: "bg-charcoal text-gold",
  "Fast Cure": "bg-gold text-charcoal",
  "Low Stock": "bg-danger text-white",
};

export function ProductBadge({ badge, stock, className }: { badge: Badge; stock?: number; className?: string }) {
  const label = badge === "Low Stock" && stock !== undefined ? `Only ${stock} left` : badge;
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-1 text-[9px] leading-none font-bold tracking-[0.14em] uppercase shadow-sm", styles[badge], className)}>
      {label}
    </span>
  );
}
