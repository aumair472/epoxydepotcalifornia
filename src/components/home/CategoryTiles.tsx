import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getCategory } from "@/lib/catalog";
import type { Category, CategorySlug } from "@/types";

/** 2×3 photo tiles with a category tint — the hero's right column. */
export function CategoryTiles({ slugs }: { slugs: readonly CategorySlug[] }) {
  const tiles = slugs.map((s) => getCategory(s)).filter((c): c is Category => Boolean(c));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4">
      {tiles.map((c, i) => (
        <li key={c.slug}>
          <Link
            href={`/shop/${c.slug}`}
            className="group relative block aspect-[5/4] overflow-hidden rounded-lg bg-charcoal shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]"
          >
            <Image
              src={c.image}
              alt=""
              fill
              preload={i < 2}
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 22vw, 46vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <span aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: c.tint, opacity: 0.78 }} />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <Icon name={c.icon} className="absolute top-3 right-3 size-5 text-white/75 sm:top-4 sm:right-4" strokeWidth={1.5} />
            <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <span className="block text-[9.5px] font-semibold tracking-[0.2em] text-white/70 uppercase">Shop</span>
              <span className="mt-0.5 block font-display text-base font-semibold text-white sm:text-lg">{c.tileLabel}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
