"use client";

import { useState } from "react";
import { useCartItems } from "@/lib/store/cart-store-provider";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export function CheckoutContent() {
  const items = useCartItems();
  const [hasStockIssues, setHasStockIssues] = useState(false);
  const [isCheckingStock, setIsCheckingStock] = useState(true);

  const handleStockStatusChange = (hasIssues: boolean, isLoading: boolean) => {
    setHasStockIssues(hasIssues);
    setIsCheckingStock(isLoading);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-light tracking-tight mb-4">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground font-[Inter,sans-serif] mb-8">
          Add some items to your cart to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-[Inter,sans-serif] tracking-wide uppercase text-foreground hover:opacity-70 transition-opacity"
        >
          <IconArrowLeft className="size-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
      {/* Left Column - Form */}
      <div className="lg:col-span-7">
        <CheckoutForm
          disabled={hasStockIssues}
          isCheckingStock={isCheckingStock}
        />
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <CheckoutSummary onStockStatusChange={handleStockStatusChange} />
        </div>
      </div>
    </div>
  );
}
