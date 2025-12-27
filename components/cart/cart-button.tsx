"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import { useTotalItems, useCartActions } from "@/lib/store/cart-store-provider";

interface CartButtonProps {
  className?: string;
  size?: "sm" | "md";
}

export function CartButton({ className, size = "md" }: CartButtonProps) {
  const totalItems = useTotalItems();
  const { openCart } = useCartActions();

  const badgeSize = size === "sm" ? "size-4 -top-1 -right-1" : "size-5 -top-2 -right-2";
  const textSize = size === "sm" ? "text-[10px]" : "text-[10px]";

  return (
    <button
      type="button"
      aria-label="Open cart"
      onClick={openCart}
      className={className}
    >
      <IconShoppingBag className="size-5" />
      <span
        className={`absolute ${badgeSize} bg-foreground text-background ${textSize} rounded-full flex items-center justify-center font-[Inter,sans-serif]`}
      >
        {totalItems}
      </span>
    </button>
  );
}
