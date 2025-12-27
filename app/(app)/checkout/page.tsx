import { Container } from "@/components/container";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Gibbarosa",
  description: "Complete your purchase of luxury preowned items.",
};

export default function CheckoutPage() {
  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-[Inter,sans-serif] tracking-wide text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <IconArrowLeft className="size-4" />
          Back to Shop
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-10">
          Checkout
        </h1>

        {/* Checkout Content */}
        <CheckoutContent />
      </Container>
    </main>
  );
}
