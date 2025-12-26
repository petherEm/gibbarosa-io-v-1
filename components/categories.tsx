"use client";

import { Container } from "./container";
import { Heading } from "./heading";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { CATEGORIES_WITH_COUNT_QUERYResult } from "@/sanity.types";

interface CategoriesProps {
  categories: CATEGORIES_WITH_COUNT_QUERYResult;
}

export const Categories = ({ categories }: CategoriesProps) => {
  // Filter to show only categories with products, limit to 5 for the grid
  const displayCategories = categories
    .filter((cat) => (cat.productCount ?? 0) > 0)
    .slice(0, 5);

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <Heading className="text-3xl md:text-4xl lg:text-5xl">
            Shop by <span className="italic font-bold">Category</span>
          </Heading>
          <Link
            href="/shop"
            className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
          >
            View All
            <IconArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block"
              >
                <div className="aspect-[5/6] relative overflow-hidden mb-4 bg-secondary">
                  {category.image?.asset?.url ? (
                    <Image
                      src={category.image.asset.url}
                      alt={category.title ?? "Category"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        No image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light text-foreground">
                    {category.title}
                  </h3>
                  <span className="text-xs font-[Inter,sans-serif] text-muted-foreground">
                    {category.productCount}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
