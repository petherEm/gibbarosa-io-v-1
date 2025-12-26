import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  MATERIALS_SANITY_LIST,
  COLORS_SANITY_LIST,
  CONDITIONS_SANITY_LIST,
} from "@/lib/constants/filters";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "provenance", title: "Provenance" },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    // Basic Details
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "details",
      validation: (rule) => [rule.required().error("Product name is required")],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "brand",
      title: "Brand / Designer",
      type: "string",
      group: "details",
      description: "e.g., Chanel, Hermès, Cartier, Louis Vuitton",
      validation: (rule) => [rule.required().error("Brand is required")],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Detailed product description",
    }),
    defineField({
      name: "price",
      type: "number",
      group: "details",
      description: "Current selling price in PLN",
      validation: (rule) => [
        rule.required().error("Price is required"),
        rule.positive().error("Price must be a positive number"),
      ],
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price",
      type: "number",
      group: "details",
      description: "Original price before discount. Leave empty if not on sale.",
      validation: (rule) => [
        rule.positive().error("Compare at price must be a positive number"),
      ],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => [rule.required().error("Category is required")],
    }),

    // Product Attributes
    defineField({
      name: "material",
      type: "string",
      group: "details",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "dropdown",
      },
      description: "Primary material",
    }),
    defineField({
      name: "color",
      type: "string",
      group: "details",
      options: {
        list: COLORS_SANITY_LIST,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "dimensions",
      type: "string",
      group: "details",
      description: 'e.g., "30 x 20 x 10 cm" or "Size 38"',
    }),

    // Provenance & Condition
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      group: "provenance",
      options: {
        list: CONDITIONS_SANITY_LIST,
        layout: "radio",
      },
      description: "Overall item condition",
    }),
    defineField({
      name: "conditionDetails",
      title: "Condition Notes",
      type: "text",
      group: "provenance",
      rows: 2,
      description: "Specific details about wear, scratches, repairs, etc.",
    }),
    defineField({
      name: "productionYear",
      title: "Year / Era",
      type: "string",
      group: "provenance",
      description: 'e.g., "2019", "1980s", "Vintage"',
    }),
    defineField({
      name: "serialNumber",
      title: "Serial / Reference Number",
      type: "string",
      group: "provenance",
      description: "Manufacturer serial or reference number",
    }),
    defineField({
      name: "accessories",
      title: "Included Accessories",
      type: "string",
      group: "provenance",
      description: 'e.g., "Dust bag, box, certificate", "Original receipt"',
    }),

    // Media
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),

    // Inventory
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      initialValue: 1,
      description: "Available quantity (typically 1 for vintage/pre-owned items)",
      validation: (rule) => [
        rule.min(0).error("Stock cannot be negative"),
        rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Feature on homepage and in promotions",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "datetime",
      group: "inventory",
      description: "When this product was added to the store (for New Arrivals sorting)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, brand, subtitle, media, price }) {
      const displayTitle = brand ? `${brand} - ${title}` : title;
      return {
        title: displayTitle,
        subtitle: `${subtitle ? `${subtitle} • ` : ""}${price?.toLocaleString() ?? 0} PLN`,
        media,
      };
    },
  },
});
