import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const columnClasses = {
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** `eagerCount` cards at the top load their photos right away (set it when the grid is above the fold). */
export function ProductGrid({
  products,
  columns = 4,
  eagerCount = 0,
  className,
}: {
  products: Product[];
  columns?: 3 | 4;
  eagerCount?: number;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3 sm:gap-5", columnClasses[columns], className)}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} eager={i < eagerCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
