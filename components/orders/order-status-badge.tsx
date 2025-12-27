import { getOrderStatus, type OrderStatusValue } from "@/lib/constants/orderStatus";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  className,
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = getOrderStatus(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-[Inter,sans-serif] tracking-wide",
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" />}
      {config.label}
    </span>
  );
}
