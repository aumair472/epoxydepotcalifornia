import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
  /** Right-aligned slot (e.g. a "Shop all →" link) on wide screens. */
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
  titleClassName,
  action,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", centered && "md:justify-center", className)}>
      <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <Tag
          className={cn(
            "font-display font-semibold tracking-[-0.01em] text-ink",
            Tag === "h1" ? "text-4xl leading-[1.08] md:text-5xl" : "text-[28px] leading-[1.15] md:text-4xl",
            titleClassName
          )}
        >
          {title}
        </Tag>
        {description && <div className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{description}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
