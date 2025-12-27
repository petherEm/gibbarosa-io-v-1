"use client";
import { useState } from "react";
import Image from "next/image";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { IconSend } from "@tabler/icons-react";
import { motion } from "motion/react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-4">
              Stay Connected
            </p>

            <Heading className="text-3xl md:text-4xl lg:text-5xl mb-6">
              Join <span className="italic font-bold">our circle</span>
            </Heading>

            <Subheading className="mb-10 max-w-md">
              Be the first to discover new arrivals, exclusive offers, and
              behind-the-scenes stories from the world of luxury fashion.
            </Subheading>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-secondary border border-border px-5 text-sm font-[Inter,sans-serif] placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 bg-foreground text-background text-sm font-[Inter,sans-serif] tracking-[0.05em] uppercase flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
              >
                Subscribe
                <IconSend className="size-4" />
              </button>
            </form>

            <p className="mt-6 text-xs font-[Inter,sans-serif] text-muted-foreground">
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
            </p>

            {/* Stats */}
            <div className="mt-10 pt-8 border-t border-border flex gap-10">
              <div>
                <p className="text-2xl font-light text-foreground">10k+</p>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground">
                  Subscribers
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-foreground">Weekly</p>
                <p className="text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground">
                  New Drops
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-[5/4] overflow-hidden hidden lg:block"
          >
            <Image
              src="/newsletter.jpg"
              alt="Luxury fashion newsletter"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
