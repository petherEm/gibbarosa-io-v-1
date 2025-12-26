"use client";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

export const StorySection = () => {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="flex gap-3 md:gap-4 h-[500px] md:h-[600px]">
              {/* Large main image */}
              <div className="flex-1 relative overflow-hidden">
                <Image
                  src="/about/about-main-01.jpg"
                  alt="Gibbarosa luxury fashion"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              </div>
              {/* Two stacked images - same total height as main */}
              <div className="w-[40%] flex flex-col gap-3 md:gap-4">
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src="/about/about-main-02.webp"
                    alt="Luxury craftsmanship detail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 35vw, 20vw"
                  />
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src="/about/about-main-03.webp"
                    alt="Preowned luxury heritage"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 35vw, 20vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-6">
              Our Story
            </p>

            <Heading className="text-3xl md:text-4xl lg:text-5xl mb-8">
              We give a second life to timeless pieces that should be treated
              <span className="italic font-bold"> as true investments</span>
            </Heading>

            <div className="space-y-6">
              <Subheading>
                Gibbarosa was born out of a love for history, heritage, and the
                savoir-faire of luxury fashion houses.
              </Subheading>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-10 text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-foreground hover:text-accent transition-colors group"
            >
              Learn More About Us
              <IconArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
