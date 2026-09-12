import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  /** Visible "4.8 · 186 reviews" style label. */
  label?: string;
}

export function StarRating({ rating, size = 14, className, label }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = rounded >= i ? 1 : rounded >= i - 0.5 ? 0.5 : 0;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-line" fill="currentColor" strokeWidth={0} size={size} />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star className="text-brand" fill="currentColor" strokeWidth={0} size={size} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {label && <span className="text-xs text-subtle">{label}</span>}
    </div>
  );
}
