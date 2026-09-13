"use client";

import { Phone } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { getProduct } from "@/lib/catalog";

interface CallToOrderButtonProps {
  productId: string;
  quantity?: number;
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  block?: boolean;
  className?: string;
}

/**
 * The buy control used on every product surface. We take orders by phone, so it
 * dials the store on touch devices and opens the "Call to order" dialog on desktop.
 */
export function CallToOrderButton({
  productId,
  quantity = 1,
  label = "Call",
  size = "sm",
  variant = "primary",
  block,
  className,
}: CallToOrderButtonProps) {
  const { requestCall } = useUI();
  const product = getProduct(productId);
  const name = product?.name ?? "this item";

  const handleClick = () => {
    requestCall({
      title: quantity > 1 ? `${quantity} × ${name}` : name,
      detail: product ? `SKU ${product.sku}` : undefined,
    });
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      block={block}
      aria-label={`Call to order ${quantity > 1 ? `${quantity} × ` : ""}${name}`}
      className={className}
    >
      <Phone aria-hidden className="size-3.5" strokeWidth={2.5} />
      {label}
    </Button>
  );
}
