"use client";

import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Container } from "@/components/container";
import { getCheckoutSession } from "@/lib/actions/checkout";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface OrderDetails {
  id: string;
  customerEmail?: string | null;
  customerName?: string | null;
  amountTotal?: number | null;
  paymentStatus?: string | null;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  lineItems?: Array<{
    name?: string | null;
    quantity?: number | null;
    amount?: number | null;
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartActions();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  // Clear cart on successful checkout
  useEffect(() => {
    if (!cartCleared) {
      clearCart();
      setCartCleared(true);
    }
  }, [clearCart, cartCleared]);

  // Fetch order details
  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId) {
        setError("No session ID provided");
        setIsLoading(false);
        return;
      }

      const result = await getCheckoutSession(sessionId);

      if (result.success && result.session) {
        setOrder(result.session);
      } else {
        setError(result.error ?? "Could not load order details");
      }

      setIsLoading(false);
    }

    fetchOrder();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-[Inter,sans-serif]">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-light tracking-tight mb-4">
          Order Confirmed
        </h1>
        <p className="text-muted-foreground font-[Inter,sans-serif] mb-8">
          Your payment was successful. We couldn&apos;t load the details, but your order is being processed.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-foreground text-background font-[Inter,sans-serif] text-sm tracking-wide uppercase hover:bg-foreground/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <IconCheck className="size-10 text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-4">
        Thank You for Your Order
      </h1>
      <p className="text-center text-muted-foreground font-[Inter,sans-serif] mb-10">
        Your order has been confirmed and is being prepared for shipment.
      </p>

      {/* Order Details Card */}
      <div className="bg-secondary/50 p-6 lg:p-8 mb-8">
        <h2 className="text-lg font-light tracking-tight mb-6">
          Order Details
        </h2>

        <div className="space-y-4 text-sm">
          {order?.customerEmail && (
            <div className="flex justify-between">
              <span className="text-muted-foreground font-[Inter,sans-serif]">
                Confirmation sent to
              </span>
              <span className="text-foreground">{order.customerEmail}</span>
            </div>
          )}

          {order?.lineItems && order.lineItems.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground font-[Inter,sans-serif] mb-3">
                Items
              </p>
              {order.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span className="text-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-foreground">
                    {((item.amount ?? 0) / 100).toLocaleString("pl-PL")} zł
                  </span>
                </div>
              ))}
            </div>
          )}

          {order?.amountTotal && (
            <div className="flex justify-between pt-4 border-t border-border text-base font-light">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                {(order.amountTotal / 100).toLocaleString("pl-PL")} zł
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {order?.shippingAddress && (
        <div className="bg-secondary/50 p-6 lg:p-8 mb-8">
          <h2 className="text-lg font-light tracking-tight mb-4">
            Shipping To
          </h2>
          <p className="text-sm text-foreground font-[Inter,sans-serif] leading-relaxed">
            {order.customerName && <>{order.customerName}<br /></>}
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.postal_code}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="px-8 py-3 bg-foreground text-background font-[Inter,sans-serif] text-sm tracking-wide uppercase hover:bg-foreground/90 transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </Container>
    </main>
  );
}
