import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { OrderSummary } from "@/lib/ai/tools/get-my-orders";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatDate, formatOrderNumber } from "@/lib/utils";

interface OrderCardWidgetProps {
  order: OrderSummary;
  onClose: () => void;
}

export function OrderCardWidget({ order, onClose }: OrderCardWidgetProps) {
  const config = getOrderStatus(order.status);

  const handleClick = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  const formattedDate = order.createdAt
    ? formatDate(order.createdAt, "short")
    : null;

  const displayItems =
    order.itemNames.length > 2
      ? `${order.itemNames.slice(0, 2).join(", ")} +${order.itemNames.length - 2} more`
      : order.itemNames.join(", ");

  // Get first image for display
  const firstImage = order.itemImages[0];

  const cardContent = (
    <>
      {/* Product image or fallback */}
      {firstImage ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-secondary">
          <Image
            src={firstImage}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
          {order.itemCount > 1 && (
            <div className="absolute bottom-0 right-0 bg-foreground/80 px-1 text-[10px] text-background">
              +{order.itemCount - 1}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-secondary">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block truncate text-sm font-light text-foreground group-hover:text-accent transition-colors">
              Order #{formatOrderNumber(order.orderNumber)}
            </span>
            {displayItems && (
              <span className="block truncate text-xs text-muted-foreground font-[Inter,sans-serif]">
                {displayItems}
              </span>
            )}
          </div>
          {order.totalFormatted && (
            <span className="shrink-0 text-sm font-light text-foreground">
              {order.totalFormatted}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-[Inter,sans-serif] ${config.iconColor}`}
          >
            {order.statusDisplay}
          </span>
          {formattedDate && (
            <>
              <span className="text-border">•</span>
              <span className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                {formattedDate}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Link
      href={order.orderUrl}
      onClick={handleClick}
      className="group flex items-center gap-3 border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
    >
      {cardContent}
    </Link>
  );
}
