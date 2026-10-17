import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import type { NavLink } from "@/types";

/**
 * Trail of links starting at Home; the final crumb (current page) renders as plain text.
 * Also emits the matching BreadcrumbList JSON-LD, so the visible trail and the schema never drift.
 */
export function Breadcrumbs({ items }: { items: (NavLink | { label: string; href?: undefined })[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-subtle">
      <JsonLd data={breadcrumbSchema(trail)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((item, i) => (
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
