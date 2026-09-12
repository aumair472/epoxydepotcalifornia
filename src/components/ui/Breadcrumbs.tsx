import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { NavLink } from "@/types";

/** Trail of links; the final crumb (current page) renders as plain text. */
export function Breadcrumbs({ items }: { items: (NavLink | { label: string; href?: undefined })[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3 text-subtle/60" />}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
