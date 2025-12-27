"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";

import { createCheckoutSession } from "@/lib/actions/checkout";
import { useCartItems } from "@/lib/store/cart-store-provider";

interface CheckoutFormProps {
  disabled?: boolean;
  isCheckingStock?: boolean;
}

export function CheckoutForm({ disabled, isCheckingStock }: CheckoutFormProps) {
  const items = useCartItems();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createCheckoutSession(items);

      if (result.success && result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError(result.error ?? "Something went wrong");
        setIsSubmitting(false);
      }
    } catch {
      setError("Failed to create checkout session");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Info about Stripe Checkout */}
      <section>
        <h2 className="text-lg font-light tracking-tight mb-4">
          Secure Checkout
        </h2>
        <p className="text-sm text-muted-foreground font-[Inter,sans-serif] leading-relaxed">
          You will be redirected to Stripe's secure checkout page to complete
          your payment and enter shipping details.
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-[Inter,sans-serif]">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || isSubmitting || isCheckingStock || items.length === 0}
        className="w-full h-14 bg-foreground text-background font-[Inter,sans-serif] text-sm tracking-wide uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting || isCheckingStock ? (
          <>
            <IconLoader2 className="size-4 animate-spin" />
            {isCheckingStock ? "Checking availability..." : "Processing..."}
          </>
        ) : disabled ? (
          "Remove unavailable items to continue"
        ) : items.length === 0 ? (
          "Your cart is empty"
        ) : (
          "Continue to Payment"
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground font-[Inter,sans-serif]">
        Payments are securely processed by Stripe
      </p>
    </form>
  );
}
