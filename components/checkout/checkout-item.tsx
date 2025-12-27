"use client";

import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import Image from "next/image";

import type { StockInfo } from "@/hooks/useCartStock";
import type { CartItem } from "@/lib/store/cart-store";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface CheckoutItemProps {
  item: CartItem;
  stockInfo?: StockInfo;
}

export function CheckoutItem({ item, stockInfo }: CheckoutItemProps) {
  const { removeItem } = useCartActions();
  const isUnavailable = stockInfo?.isOutOfStock ?? false;

  return (
    <div
      className={`flex gap-4 py-4 border-b border-border last:border-b-0 ${
        isUnavailable ? "opacity-60" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative w-16 h-20 shrink-0 bg-secondary overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h4 className="text-sm font-medium text-foreground truncate">
            {item.name}
          </h4>

          {/* Stock Warning */}
          {isUnavailable && (
            <div className="flex items-center gap-1 mt-1 text-red-600">
              <IconAlertTriangle className="size-3" />
              <span className="text-xs font-[Inter,sans-serif]">
                No longer available
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-foreground">
          {item.price.toLocaleString("pl-PL")} zł
        </p>
      </div>

      {/* Remove Button (shown for unavailable items) */}
      {isUnavailable && (
        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          className="self-start p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <IconX className="size-4" />
        </button>
      )}
    </div>
  );
}
