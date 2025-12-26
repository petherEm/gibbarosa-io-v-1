import { defineField, defineType } from "sanity";
import { IconHome } from "@tabler/icons-react";

export const heroSettingsType = defineType({
  name: "heroSettings",
  title: "Hero Settings",
  type: "document",
  icon: IconHome,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Hero Settings",
      hidden: true,
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products (Just Arrived)",
      description: "Select up to 3 products to rotate in the hero section. The product image will be displayed as the main hero image.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      validation: (Rule) =>
        Rule.max(3).error("You can select a maximum of 3 products"),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Hero Settings",
        subtitle: "Configure hero section products",
      };
    },
  },
});
