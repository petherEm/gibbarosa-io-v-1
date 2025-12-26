"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@tabler/icons-react";
import { CONDITIONS, COLORS, MATERIALS } from "@/lib/constants/filters";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductDetailsProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

// Helper to get label from value
function getLabel(
  value: string | null,
  options: ReadonlyArray<{ value: string; label: string }>
): string | null {
  if (!value) return null;
  const option = options.find((o) => o.value === value);
  return option?.label ?? value;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  // Build condition display string
  const conditionLabel = getLabel(product.condition, CONDITIONS);
  const conditionDisplay = product.conditionDetails
    ? `${conditionLabel} (${product.conditionDetails})`
    : conditionLabel;

  // Get display labels for color and material
  const colorLabel = getLabel(product.color, COLORS);
  const materialLabel = getLabel(product.material, MATERIALS);

  // Detail items to display
  const details = [
    { label: "Condition", value: conditionDisplay },
    { label: "Accessories", value: product.accessories },
    { label: "Collection / Year of production", value: product.productionYear },
    { label: "Color", value: colorLabel },
    { label: "Material", value: materialLabel },
    { label: "Size / Dimensions", value: product.dimensions },
    { label: "Serial Number", value: product.serialNumber },
  ].filter((item) => item.value);

  return (
    <div className="border-t border-border pt-8">
      {/* Quick Details List */}
      <div className="space-y-4 mb-8">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-sm font-medium text-foreground">
              {detail.label}:
            </span>
            <span className="text-sm text-muted-foreground">{detail.value}</span>
          </div>
        ))}
      </div>

      {/* Expandable Description Section */}
      {product.description && (
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="w-full py-5 flex items-center justify-between text-left"
          >
            <span className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground">
              Detailed Description
            </span>
            <IconChevronDown
              className={cn(
                "size-5 text-foreground transition-transform duration-200",
                isDescriptionOpen && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isDescriptionOpen ? "max-h-[500px] pb-6" : "max-h-0"
            )}
          >
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Additional Sections */}
      <AccordionItem title="Shipping & Returns">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Free Shipping:</strong> On all
            orders over 500 zł within Poland.
          </p>
          <p>
            <strong className="text-foreground">International Shipping:</strong>{" "}
            Available to most EU countries. Rates calculated at checkout.
          </p>
          <p>
            <strong className="text-foreground">Returns:</strong> 14-day return
            policy for unworn items in original condition with all tags attached.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="Authentication">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Every item is thoroughly authenticated by our team of experts using
            both traditional methods and AI-powered verification technology.
          </p>
          <p>
            We guarantee 100% authenticity on all items. If you have any concerns,
            please contact our team.
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground">
          {title}
        </span>
        <IconChevronDown
          className={cn(
            "size-5 text-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px] pb-6" : "max-h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
