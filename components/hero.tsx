"use client";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface HeroProduct {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  brand: string | null;
  image: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
}

interface HeroProps {
  heroProducts: HeroProduct[];
}

export const Hero = ({ heroProducts }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const currentProduct = heroProducts[currentIndex];
  return (
    <section className="pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-2 mb-6">
              <IconShieldCheck className="size-4 text-accent" />
              <span className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-muted-foreground">
                Human-Authenticated Luxury
              </span>
            </div>

            <Heading as="h1" className="mb-8">
              Iconic fashion,{" "}
              <span className="italic font-bold">second chapter</span>
            </Heading>

            <Subheading className="mb-10">
              Discover our curated selection of authenticated preowned luxury
              bags, accessories, and fashion pieces from the world's most
              prestigious houses.
            </Subheading>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button size="lg" className="group">
                <span>Explore Collection</span>
                <IconArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link
                  href="/sell"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sell With Us
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-light text-foreground">100%</p>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground">
                  Authenticated
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-foreground">14 Days</p>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground">
                  Free Returns
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-foreground">5000+</p>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground">
                  Happy Clients
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
              <AnimatePresence mode="wait">
                {currentProduct?.image?.asset?.url ? (
                  <motion.div
                    key={currentProduct._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentProduct.image.asset.url}
                      alt={currentProduct.name ?? "Featured product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                ) : (
                  <Image
                    src="/elegant-luxury-designer-handbag-chanel-classic-on-.jpg"
                    alt="Luxury designer handbag"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Floating Card */}
            {currentProduct && (
              <div className="absolute -left-4 md:-left-8 bottom-12 bg-card p-4 md:p-6 shadow-lg max-w-50 md:max-w-60">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProduct._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/product/${currentProduct.slug}`}>
                      <p className="text-xs font-[Inter,sans-serif] tracking-widest uppercase text-accent mb-2">
                        Just Arrived
                      </p>
                      <p className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                        {currentProduct.brand}
                      </p>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {currentProduct.name}
                      </p>
                      <p className="text-lg font-light text-foreground mt-1">
                        {currentProduct.price?.toLocaleString()} PLN
                      </p>
                    </Link>
                  </motion.div>
                </AnimatePresence>
                {/* Progress dots */}
                {heroProducts.length > 1 && (
                  <div className="flex gap-1.5 mt-3">
                    {heroProducts.map((product, index) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`size-1.5 rounded-full transition-colors ${
                          index === currentIndex
                            ? "bg-accent"
                            : "bg-muted-foreground/30"
                        }`}
                        aria-label={`View product ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
