import { CheckCircle2, Loader2, Package, Search } from "lucide-react";
import type { GetMyOrdersResult } from "@/lib/ai/tools/get-my-orders";
import type { SearchProductsResult } from "@/lib/ai/types";
import { OrderCardWidget } from "./order-card-widget";
import { ProductCardWidget } from "./product-card-widget";
import type { ToolCallPart } from "./types";
import { getToolDisplayName } from "./utils";

interface ToolCallUIProps {
  toolPart: ToolCallPart;
  closeChat: () => void;
}

export function ToolCallUI({ toolPart, closeChat }: ToolCallUIProps) {
  const toolName = toolPart.toolName || toolPart.type.replace("tool-", "");
  const displayName = getToolDisplayName(toolName);

  const isComplete =
    toolPart.state === "result" ||
    toolPart.result !== undefined ||
    toolPart.output !== undefined;

  const searchQuery =
    toolName === "searchProducts" && toolPart.args?.query
      ? String(toolPart.args.query)
      : undefined;

  const orderStatus =
    toolName === "getMyOrders" && toolPart.args?.status
      ? String(toolPart.args.status)
      : undefined;

  const result = toolPart.result || toolPart.output;
  const productResult = result as SearchProductsResult | undefined;
  const orderResult = result as GetMyOrdersResult | undefined;

  const hasProducts =
    toolName === "searchProducts" &&
    productResult?.found &&
    productResult.products &&
    productResult.products.length > 0;

  const hasOrders =
    toolName === "getMyOrders" &&
    orderResult?.found &&
    orderResult.orders &&
    orderResult.orders.length > 0;

  const ToolIcon = toolName === "getMyOrders" ? Package : Search;

  return (
    <div className="space-y-2">
      {/* Tool status indicator */}
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-secondary">
          <ToolIcon className="h-4 w-4 text-accent" />
        </div>
        <div
          className={`flex items-center gap-3 px-4 py-2 text-sm border ${
            isComplete
              ? "bg-secondary/50 border-border"
              : "bg-secondary/30 border-border"
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
          ) : (
            <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-[Inter,sans-serif] text-xs tracking-[0.05em] uppercase text-foreground">
              {isComplete ? `${displayName} complete` : `${displayName}...`}
            </span>
            {searchQuery && (
              <span className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                Query: &quot;{searchQuery}&quot;
              </span>
            )}
            {orderStatus && (
              <span className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                Filter: {orderStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product results */}
      {hasProducts && productResult?.products && (
        <div className="ml-11 mt-2">
          <p className="text-xs text-muted-foreground font-[Inter,sans-serif] mb-2">
            {productResult.products.length} item
            {productResult.products.length !== 1 ? "s" : ""} found
          </p>
          <div className="space-y-2">
            {productResult.products.map((product) => (
              <ProductCardWidget
                key={product.id}
                product={product}
                onClose={closeChat}
              />
            ))}
          </div>
        </div>
      )}

      {/* Order results */}
      {hasOrders && orderResult?.orders && (
        <div className="ml-11 mt-2">
          <p className="text-xs text-muted-foreground font-[Inter,sans-serif] mb-2">
            {orderResult.orders.length} order
            {orderResult.orders.length !== 1 ? "s" : ""} found
          </p>
          <div className="space-y-2">
            {orderResult.orders.map((order) => (
              <OrderCardWidget
                key={order.id}
                order={order}
                onClose={closeChat}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
