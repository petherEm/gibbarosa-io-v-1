import { auth } from "@clerk/nextjs/server";
import { IconPackage } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { OrderCard } from "@/components/orders";
import { ORDERS_BY_USER_QUERY } from "@/lib/sanity/queries/orders";
import { sanityFetch } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "My Orders | Gibbarosa",
  description: "View your order history and track shipments.",
};

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/account/orders");
  }

  const { data: orders } = await sanityFetch({
    query: ORDERS_BY_USER_QUERY,
    params: { clerkUserId: userId },
  });

  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground font-[Inter,sans-serif]">
            View your order history and track shipments.
          </p>
        </div>

        {/* Orders List */}
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/30">
            <IconPackage className="size-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-light tracking-tight mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground font-[Inter,sans-serif] mb-6">
              When you place an order, it will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-foreground text-background font-[Inter,sans-serif] text-sm tracking-wide uppercase hover:bg-foreground/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}
