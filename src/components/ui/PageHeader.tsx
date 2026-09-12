import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/cn";
import type { NavLink } from "@/types";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  body?: React.ReactNode;
  breadcrumbs?: (NavLink | { label: string; href?: undefined })[];
  className?: string;
  children?: React.ReactNode;
}

/** Cream intro band used at the top of inner pages. */
export function PageHeader({ eyebrow, title, body, breadcrumbs, className, children }: PageHeaderProps) {
  return (
    <section className={cn("border-b border-line bg-cream", className)}>
      <div className="container-page py-10 md:py-14">
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-[36px] leading-[1.08] font-bold tracking-[-0.01em] text-ink md:text-5xl">{title}</h1>
        {body && <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-[17px]">{body}</div>}
        {children}
      </div>
    </section>
  );
}
