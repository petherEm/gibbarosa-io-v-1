import { auth } from "@clerk/nextjs/server";
import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/container";
import { OrderStatusBadge } from "@/components/orders";
import { ORDER_BY_NUMBER_FOR_USER_QUERY } from "@/lib/sanity/queries/orders";
import { sanityFetch } from "@/sanity/lib/live";

interface OrderItem {
  _key: string | null;
  quantity: number | null;
  priceAtPurchase: number | null;
  product: {
    _id: string;
    name: string | null;
    brand: string | null;
    slug: string | null;
    image: {
      asset: {
        _id: string;
        url: string | null;
      } | null;
    } | null;
  } | null;
}

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber} | Gibbarosa`,
    description: "View your order details.",
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=/account/orders/${orderNumber}`);
  }

  const { data: order } = await sanityFetch({
    query: ORDER_BY_NUMBER_FOR_USER_QUERY,
    params: { orderNumber, clerkUserId: userId },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-[Inter,sans-serif] tracking-wide text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <IconArrowLeft className="size-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-1">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground font-[Inter,sans-serif]">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="self-start" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-light tracking-tight mb-4">Items</h2>
            <div className="bg-secondary/30 divide-y divide-border">
              {order.items?.map((item: OrderItem) => (
                <div key={item._key} className="flex gap-4 p-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-24 shrink-0 bg-secondary overflow-hidden">
                    {item.product?.image?.asset?.url ? (
                      <Image
                        src={item.product.image.asset.url}
                        alt={item.product.name ?? "Product"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          No image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    {item.product?.brand && (
                      <p className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                        {item.product.brand}
                      </p>
                    )}
                    <Link
                      href={`/product/${item.product?.slug}`}
                      className="text-sm font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-xs text-muted-foreground font-[Inter,sans-serif] mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-light text-foreground">
                      {item.priceAtPurchase?.toLocaleString("pl-PL")} zł
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Total */}
            <div className="bg-secondary/30 p-6">
              <h2 className="text-lg font-light tracking-tight mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-[Inter,sans-serif]">
                    Subtotal
                  </span>
                  <span className="text-foreground">
                    {order.total?.toLocaleString("pl-PL")} zł
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-[Inter,sans-serif]">
                    Shipping
                  </span>
                  <span className="text-foreground">Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-base font-light">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">
                    {order.total?.toLocaleString("pl-PL")} zł
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.address && (
              <div className="bg-secondary/30 p-6">
                <h2 className="text-lg font-light tracking-tight mb-4">
                  Shipping Address
                </h2>
                <p className="text-sm text-foreground font-[Inter,sans-serif] leading-relaxed">
                  {order.address.name}
                  <br />
                  {order.address.line1}
                  {order.address.line2 && (
                    <>
                      <br />
                      {order.address.line2}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.postcode}
                  <br />
                  {order.address.country}
                </p>
              </div>
            )}

            {/* Order Info */}
            <div className="bg-secondary/30 p-6">
              <h2 className="text-lg font-light tracking-tight mb-4">
                Order Information
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground font-[Inter,sans-serif]">
                    Order Number
                  </span>
                  <p className="text-foreground">{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-[Inter,sans-serif]">
                    Email
                  </span>
                  <p className="text-foreground">{order.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
