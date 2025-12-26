"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  COLORS,
  MATERIALS,
  CONDITIONS,
  SORT_OPTIONS,
} from "@/lib/constants/filters";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface ShopFiltersProps {
  categories: ALL_CATEGORIES_QUERYResult;
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") ?? "";
  const currentCondition = searchParams.get("condition") ?? "";
  const currentColor = searchParams.get("color") ?? "";
  const currentMaterial = searchParams.get("material") ?? "";
  const currentSort = searchParams.get("sort") ?? "name";
  const currentSearch = searchParams.get("q") ?? "";

  // Create URL with updated params
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  // Update URL with new filter
  const updateFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Check if any filters are active
  const hasActiveFilters =
    currentCategory ||
    currentCondition ||
    currentColor ||
    currentMaterial ||
    currentSearch;

  return (
    <div className="space-y-6">
      {/* Sort (Mobile: full width, Desktop: hidden - shown in products header) */}
      <div className="lg:hidden">
        <FilterSection title="Sort By" defaultOpen>
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border text-sm font-[Inter,sans-serif] focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterSection>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
          {currentCategory && (
            <FilterTag
              label={
                categories.find((c) => c.slug === currentCategory)?.title ??
                currentCategory
              }
              onRemove={() => updateFilter("category", null)}
            />
          )}
          {currentCondition && (
            <FilterTag
              label={
                CONDITIONS.find((c) => c.value === currentCondition)?.label ??
                currentCondition
              }
              onRemove={() => updateFilter("condition", null)}
            />
          )}
          {currentColor && (
            <FilterTag
              label={
                COLORS.find((c) => c.value === currentColor)?.label ??
                currentColor
              }
              onRemove={() => updateFilter("color", null)}
            />
          )}
          {currentMaterial && (
            <FilterTag
              label={
                MATERIALS.find((m) => m.value === currentMaterial)?.label ??
                currentMaterial
              }
              onRemove={() => updateFilter("material", null)}
            />
          )}
          {currentSearch && (
            <FilterTag
              label={`"${currentSearch}"`}
              onRemove={() => updateFilter("q", null)}
            />
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Category Filter */}
      <FilterSection title="Category" defaultOpen>
        <div className="space-y-2">
          <FilterOption
            label="All"
            isActive={!currentCategory}
            onClick={() => updateFilter("category", null)}
          />
          {categories.map((category) => (
            <FilterOption
              key={category._id}
              label={category.title ?? ""}
              isActive={currentCategory === category.slug}
              onClick={() =>
                updateFilter(
                  "category",
                  currentCategory === category.slug ? null : category.slug
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Condition Filter */}
      <FilterSection title="Condition" defaultOpen>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <FilterOption
              key={condition.value}
              label={condition.label}
              isActive={currentCondition === condition.value}
              onClick={() =>
                updateFilter(
                  "condition",
                  currentCondition === condition.value ? null : condition.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() =>
                updateFilter(
                  "color",
                  currentColor === color.value ? null : color.value
                )
              }
              className={cn(
                "px-3 py-1.5 text-xs font-[Inter,sans-serif] border transition-colors",
                currentColor === color.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              )}
            >
              {color.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Material Filter */}
      <FilterSection title="Material">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {MATERIALS.map((material) => (
            <FilterOption
              key={material.value}
              label={material.label}
              isActive={currentMaterial === material.value}
              onClick={() =>
                updateFilter(
                  "material",
                  currentMaterial === material.value ? null : material.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// Filter Section with collapsible content
function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2"
      >
        <span className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground">
          {title}
        </span>
        <IconChevronDown
          className={cn(
            "size-4 text-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Individual filter option
function FilterOption({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full text-left text-sm font-[Inter,sans-serif] py-1 transition-colors",
        isActive
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// Active filter tag
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-xs font-[Inter,sans-serif]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-accent transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <IconX className="size-3" />
      </button>
    </span>
  );
}
