"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SORT_OPTIONS } from "@/lib/constants/filters";
import type { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

interface ShopProductsProps {
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ShopProducts({ products }: ShopProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "name";

  // Update sort parameter
  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "name") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div>
      {/* Desktop Sort Header */}
      <div className="hidden lg:flex items-center justify-end mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-[Inter,sans-serif] text-muted-foreground">
            Sort by:
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="px-3 py-1.5 bg-background border border-border text-sm font-[Inter,sans-serif] focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-light text-foreground mb-2">
            No products found
          </p>
          <p className="text-sm text-muted-foreground font-[Inter,sans-serif]">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}
