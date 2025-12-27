"use client";

import Image from "next/image";
import { useCartActions } from "@/lib/store/cart-store-provider";
import type { CartItem as CartItemType } from "@/lib/store/cart-store";
import { IconX } from "@tabler/icons-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCartActions();

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-24 flex-shrink-0 bg-secondary overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h4 className="text-sm font-medium text-foreground truncate pr-6">
            {item.name}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {item.price.toLocaleString("pl-PL")} zł
          </p>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeItem(item.productId)}
        className="self-start p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Remove ${item.name} from cart`}
      >
        <IconX className="size-4" />
      </button>
    </div>
  );
}
