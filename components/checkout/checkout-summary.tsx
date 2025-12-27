"use client";

import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { useEffect } from "react";

import { useCartStock } from "@/hooks/useCartStock";
import { useCartItems, useTotalPrice } from "@/lib/store/cart-store-provider";
import { CheckoutItem } from "./checkout-item";

interface CheckoutSummaryProps {
  onStockStatusChange?: (hasIssues: boolean, isLoading: boolean) => void;
}

export function CheckoutSummary({ onStockStatusChange }: CheckoutSummaryProps) {
  const items = useCartItems();
  const subtotal = useTotalPrice();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  // Notify parent of stock status changes
  useEffect(() => {
    onStockStatusChange?.(hasStockIssues, isLoading);
  }, [hasStockIssues, isLoading, onStockStatusChange]);

  // Calculate available items total (excluding out of stock)
  const availableTotal = items.reduce((sum, item) => {
    const stockInfo = stockMap.get(item.productId);
    if (stockInfo?.isOutOfStock) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  const shipping: number = 0; // Free shipping or calculated later
  const total = availableTotal + shipping;

  return (
    <div className="bg-secondary/50 p-6 lg:p-8">
      <h2 className="text-lg font-light tracking-tight mb-6">Order Summary</h2>

      {/* Stock Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <IconLoader2 className="size-4 animate-spin" />
          <span className="text-sm font-[Inter,sans-serif]">
            Checking availability...
          </span>
        </div>
      )}

      {/* Stock Warning Banner */}
      {hasStockIssues && !isLoading && (
        <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 text-red-800">
          <IconAlertTriangle className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Some items are unavailable</p>
            <p className="text-xs mt-1 opacity-80">
              Please remove unavailable items to continue with checkout.
            </p>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="mb-6">
        {items.map((item) => (
          <CheckoutItem
            key={item.productId}
            item={item}
            stockInfo={stockMap.get(item.productId)}
          />
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-[Inter,sans-serif]">
            Subtotal
          </span>
          <span className="text-foreground">
            {subtotal.toLocaleString("pl-PL")} zł
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-[Inter,sans-serif]">
            Shipping
          </span>
          <span className="text-foreground">
            {shipping === 0 ? "Free" : `${shipping.toLocaleString("pl-PL")} zł`}
          </span>
        </div>

        <div className="flex justify-between text-lg font-light pt-3 border-t border-border">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">
            {total.toLocaleString("pl-PL")} zł
          </span>
        </div>
      </div>
    </div>
  );
}
