"use client";

import { Container } from "./container";
import { Heading } from "./heading";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { IconHeart, IconArrowUpRight } from "@tabler/icons-react";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

interface FeaturedProductsProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

// Map condition values to display labels
const conditionLabels: Record<string, string> = {
  new: "New",
  "like-new": "Like New",
  excellent: "Excellent",
  "very-good": "Very Good",
  good: "Good",
};

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  // Limit to 4 products for the grid
  const displayProducts = products.slice(0, 4);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 bg-card">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-4">
              {"Collector's Selection"}
            </p>
            <Heading className="text-3xl md:text-4xl lg:text-5xl">
              Featured <span className="italic font-bold">Pieces</span>
            </Heading>
          </div>
          <Link
            href="/shop?featured=true"
            className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
          >
            View All New Arrivals
            <IconArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="aspect-[4/5] relative overflow-hidden mb-4 bg-secondary">
                  {product.images?.[0]?.asset?.url ? (
                    <Image
                      src={product.images[0].asset.url}
                      alt={product.name ?? "Product"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        No image
                      </span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 size-10 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    aria-label="Add to wishlist"
                  >
                    <IconHeart className="size-5" />
                  </Button>
                  {product.condition && (
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-background/90 backdrop-blur-sm px-3 py-1.5 text-foreground">
                        {conditionLabels[product.condition] ??
                          product.condition}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  {product.brand}
                </p>
                <h3 className="text-base md:text-lg font-light text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-lg font-light text-foreground">
                  {product.price?.toLocaleString()} PLN
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
