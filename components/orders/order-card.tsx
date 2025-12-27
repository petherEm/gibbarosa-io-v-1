import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { OrderStatusBadge } from "./order-status-badge";

interface OrderCardProps {
  order: {
    _id: string;
    orderNumber: string | null;
    total: number | null;
    status: string | null;
    createdAt: string | null;
    itemCount: number | null;
    itemNames: Array<string | null> | null;
    itemImages: Array<string | null> | null;
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderCard({ order }: OrderCardProps) {
  const images = order.itemImages?.filter(Boolean).slice(0, 3) ?? [];
  const itemNames = order.itemNames?.filter(Boolean) ?? [];
  const displayNames = itemNames.slice(0, 2).join(", ");
  const moreCount = itemNames.length > 2 ? itemNames.length - 2 : 0;

  return (
    <Link
      href={`/account/orders/${order.orderNumber}`}
      className="block bg-secondary/30 hover:bg-secondary/50 transition-colors p-4 sm:p-6"
    >
      <div className="flex gap-4 sm:gap-6">
        {/* Product Images */}
        <div className="flex -space-x-3 shrink-0">
          {images.length > 0 ? (
            images.map((url, i) => (
              <div
                key={i}
                className="relative w-14 h-14 sm:w-16 sm:h-16 border-2 border-background bg-secondary overflow-hidden"
              >
                <Image
                  src={url!}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ))
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-[Inter,sans-serif] mb-1">
                {formatDate(order.createdAt)}
              </p>
              <p className="text-sm font-medium text-foreground mb-1 truncate">
                {displayNames}
                {moreCount > 0 && (
                  <span className="text-muted-foreground">
                    {" "}
                    +{moreCount} more
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                {order.orderNumber}
              </p>
            </div>

            <div className="text-right shrink-0">
              <OrderStatusBadge status={order.status} className="mb-2" />
              <p className="text-sm font-light text-foreground">
                {order.total?.toLocaleString("pl-PL")} zł
              </p>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div className="hidden sm:flex items-center">
          <IconChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
