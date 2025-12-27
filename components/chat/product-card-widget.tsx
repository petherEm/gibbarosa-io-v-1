import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { SearchProduct } from "@/lib/ai/types";

interface ProductCardWidgetProps {
  product: SearchProduct;
  onClose: () => void;
}

export function ProductCardWidget({
  product,
  onClose,
}: ProductCardWidgetProps) {
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleClick = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  const cardContent = (
    <>
      {product.imageUrl ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-secondary">
          <Image
            src={product.imageUrl}
            alt={product.name ?? "Product"}
            fill
            className="object-cover"
            sizes="48px"
          />
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
              {product.name}
            </span>
            {product.category && (
              <span className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                {product.category}
              </span>
            )}
          </div>
          {product.priceFormatted && (
            <span className="shrink-0 text-sm font-light text-foreground">
              {product.priceFormatted}
            </span>
          )}
        </div>
        {isOutOfStock && (
          <span className="mt-1 inline-block text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase text-destructive">
            Gone Forever
          </span>
        )}
      </div>
    </>
  );

  const cardClasses =
    "group flex items-center gap-3 border border-border bg-card p-3 transition-colors hover:bg-secondary/50";

  if (product.productUrl) {
    return (
      <Link
        href={product.productUrl}
        onClick={handleClick}
        className={cardClasses}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}
