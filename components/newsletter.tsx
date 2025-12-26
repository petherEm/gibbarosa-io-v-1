"use client";
import { useState } from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { IconSend } from "@tabler/icons-react";
import { motion } from "motion/react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-4">
            Stay Connected
          </p>

          <Heading className="text-3xl md:text-4xl lg:text-5xl mb-6">
            Join our circle
          </Heading>

          <Subheading className="mx-auto mb-10">
            Be the first to discover new arrivals, exclusive offers, and
            behind-the-scenes stories from the world of luxury fashion.
          </Subheading>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-secondary border border-border px-6 py-4 text-sm font-[Inter,sans-serif] placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              required
            />
            <Button type="submit" size="lg" className="px-8">
              Subscribe
              <IconSend className="ml-2 size-4" />
            </Button>
          </form>

          <p className="mt-6 text-xs font-[Inter,sans-serif] text-muted-foreground">
            By subscribing, you agree to our Privacy Policy. Unsubscribe
            anytime.
          </p>
        </motion.div>
      </Container>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </section>
  );
};
