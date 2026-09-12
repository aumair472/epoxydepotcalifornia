import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const columnClasses = {
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function ProductGrid({ products, columns = 4, className }: { products: Product[]; columns?: 3 | 4; className?: string }) {
  return (
    <ul className={cn("grid gap-3 sm:gap-5", columnClasses[columns], className)}>
      {products.map((p) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
