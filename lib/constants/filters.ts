// ============================================
// Product Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const COLORS = [
  // Neutrals
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "grey", label: "Grey" },
  { value: "cream", label: "Cream" },
  { value: "beige", label: "Beige" },
  // Browns
  { value: "brown", label: "Brown" },
  { value: "caramel", label: "Caramel" },
  { value: "cognac", label: "Cognac" },
  { value: "latte", label: "Latte" },
  // Metallics
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "rose-gold", label: "Rose Gold" },
  // Colors
  { value: "red", label: "Red" },
  { value: "burgundy", label: "Burgundy" },
  { value: "pink", label: "Pink" },
  { value: "plum", label: "Plum" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "navy", label: "Navy" },
  { value: "purple", label: "Purple" },
  // Special
  { value: "transparent", label: "Transparent" },
  { value: "multicolor", label: "Multicolor" },
] as const;

export const MATERIALS = [
  // Leathers
  { value: "leather", label: "Leather" },
  // Metals & Precious
  { value: "metal", label: "Metal" },
  { value: "gold", label: "Gold" },
  { value: "rose-gold", label: "Rose Gold" },
  { value: "white-gold", label: "White Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  // Textiles
  { value: "fabric", label: "Fabric" },
  { value: "silk", label: "Silk" },
  { value: "wool", label: "Wool" },
  { value: "cashmere", label: "Cashmere" },
  { value: "cotton", label: "Cotton" },
  { value: "canvas", label: "Canvas" },
  { value: "coated-canvas", label: "Coated Canvas" },
  { value: "nylon", label: "Nylon" },
  // Other
  { value: "wood", label: "Wood" },
  { value: "glass", label: "Glass" },
  { value: "acetate", label: "Acetate" },
  { value: "optyl", label: "Optyl" },
  { value: "titanium", label: "Titanium" },
  { value: "diamond", label: "Diamond" },
] as const;

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "very-good", label: "Very Good" },
  { value: "good", label: "Good" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "relevance", label: "Relevance" },
] as const;

// Type exports
export type ColorValue = (typeof COLORS)[number]["value"];
export type MaterialValue = (typeof MATERIALS)[number]["value"];
export type ConditionValue = (typeof CONDITIONS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Colors formatted for Sanity schema options.list */
export const COLORS_SANITY_LIST = COLORS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Materials formatted for Sanity schema options.list */
export const MATERIALS_SANITY_LIST = MATERIALS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Conditions formatted for Sanity schema options.list */
export const CONDITIONS_SANITY_LIST = CONDITIONS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Color values array for zod enums or validation */
export const COLOR_VALUES = COLORS.map((c) => c.value) as [
  ColorValue,
  ...ColorValue[],
];

/** Material values array for zod enums or validation */
export const MATERIAL_VALUES = MATERIALS.map((m) => m.value) as [
  MaterialValue,
  ...MaterialValue[],
];

/** Condition values array for zod enums or validation */
export const CONDITION_VALUES = CONDITIONS.map((c) => c.value) as [
  ConditionValue,
  ...ConditionValue[],
];
