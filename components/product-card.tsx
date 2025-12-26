"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONDITIONS } from "@/lib/constants/filters";

interface ProductCardProps {
  product: {
    _id: string;
    name: string | null;
    slug: string | null;
    brand: string | null;
    price: number | null;
    compareAtPrice?: number | null;
    condition: string | null;
    images: Array<{
      _key: string;
      asset: {
        _id: string;
        url: string | null;
      } | null;
    }> | null;
    stock: number | null;
  };
  className?: string;
}

// Get condition label from value
function getConditionLabel(value: string | null): string | null {
  if (!value) return null;
  const condition = CONDITIONS.find((c) => c.value === value);
  return condition?.label ?? value;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images?.filter((img) => img.asset?.url) ?? [];
  const primaryImage = images[0]?.asset?.url;
  const secondaryImage = images[1]?.asset?.url;
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const conditionLabel = getConditionLabel(product.condition);
  const isOnSale =
    product.compareAtPrice &&
    product.price &&
    product.compareAtPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-secondary mb-4">
        {primaryImage ? (
          <>
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name ?? "Product"}
              fill
              className={cn(
                "object-cover transition-opacity duration-500",
                isHovered && secondaryImage ? "opacity-0" : "opacity-100"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Secondary Image (on hover) */}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={product.name ?? "Product"}
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {isOnSale && (
            <span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-red-600 px-2.5 py-1 text-white">
              Sale
            </span>
          )}
          {conditionLabel && (
            <span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-background/90 backdrop-blur-sm px-2.5 py-1 text-foreground">
              {conditionLabel}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-foreground">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        {/* Brand */}
        <p className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-muted-foreground mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-sm md:text-base font-light text-foreground mb-1.5 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm md:text-base font-light",
              isOnSale ? "text-red-600" : "text-foreground"
            )}
          >
            {product.price?.toLocaleString("pl-PL")} zł
          </p>
          {isOnSale && (
            <p className="text-sm md:text-base font-light text-muted-foreground line-through">
              {product.compareAtPrice?.toLocaleString("pl-PL")} zł
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
