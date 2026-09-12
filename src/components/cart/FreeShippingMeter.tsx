import { Truck } from "lucide-react";
import { siteConfig } from "@/data/mockData";
import { formatPrice } from "@/lib/format";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] text-ink">
        <Truck aria-hidden className="size-4 text-brand" />
        {remaining > 0 ? (
          <span>
            You&apos;re <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free shipping
          </span>
        ) : (
          <span className="font-semibold text-emerald-700">You&apos;ve unlocked free shipping!</span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress toward free shipping"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
