"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, ShoppingCart } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  block?: boolean;
  icon?: "plus" | "cart";
  className?: string;
}

/**
 * The single "instant add" control used on every product surface. Adds to the cart,
 * slides the cart drawer open, and briefly confirms with "Added".
 */
export function AddToCartButton({
  productId,
  quantity = 1,
  label = "Add",
  size = "sm",
  variant = "primary",
  block,
  icon = "plus",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const name = getProduct(productId)?.name ?? "item";

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    addItem(productId, quantity);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
  };

  const LeadIcon = icon === "cart" ? ShoppingCart : Plus;

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      block={block}
      aria-label={`Add ${quantity > 1 ? `${quantity} × ` : ""}${name} to cart`}
      className={cn(added && "bg-emerald-600 text-white hover:bg-emerald-600", className)}
    >
      {added ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : <LeadIcon aria-hidden className="size-3.5" strokeWidth={3} />}
      {added ? "Added" : label}
    </Button>
  );
}
