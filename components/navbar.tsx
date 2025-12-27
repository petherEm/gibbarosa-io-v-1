"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  IconMenu2,
  IconPackage,
  IconSearch,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { CartButton } from "./cart/cart-button";
import { Container } from "./container";
import { Logo } from "./logo";
import { useChatActions } from "@/lib/store/chat-store-provider";

const navlinks = [
  { title: "Shop All", href: "/shop" },
  { title: "New Arrivals", href: "/shop?sort=newest" },
  { title: "Promotions", href: "/shop?sale=true" },
  { title: "About", href: "/about" },
];

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <DesktopNavbar />
      <MobileNavbar />
    </header>
  );
};

export const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const { openChat } = useChatActions();
  return (
    <div className="flex lg:hidden px-6 py-4 justify-between items-center relative">
      <button onClick={() => setOpen(!open)} aria-label="Open menu">
        <IconMenu2 className="size-5 text-foreground" />
      </button>

      <Logo />

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Search">
          <IconSearch className="size-5 text-foreground" />
        </button>
        <button
          type="button"
          aria-label="AI Assistant"
          onClick={openChat}
        >
          <IconSparkles className="size-5 text-foreground" />
        </button>
        <CartButton className="relative text-foreground" size="sm" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 h-full w-full z-50 bg-background px-6 py-4 flex flex-col"
          >
            <div className="flex justify-between items-center">
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <IconX className="size-5" />
              </button>
              <Logo />
              <div className="w-5" />
            </div>

            <nav className="flex flex-col gap-8 mt-16">
              {navlinks.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={item.title}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-3xl font-light tracking-wide text-foreground hover:text-accent transition-colors"
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pb-8 flex flex-col gap-4">
              <SignedIn>
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-foreground flex items-center gap-2"
                >
                  <IconPackage className="size-4" />
                  My Orders
                </Link>
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-foreground"
                >
                  Create Account
                </Link>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DesktopNavbar = () => {
  const { openChat } = useChatActions();
  return (
    <Container className="py-5 items-center justify-between hidden lg:flex">
      <Logo />

      <nav className="flex items-center gap-10">
        {navlinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button
          type="button"
          aria-label="Search"
          className="hover:text-accent transition-colors"
        >
          <IconSearch className="size-5" />
        </button>

        <button
          type="button"
          aria-label="AI Assistant"
          onClick={openChat}
          className="hover:text-accent transition-colors"
          title="AI Assistant"
        >
          <IconSparkles className="size-5" />
        </button>

        <SignedIn>
          <Link
            href="/account/orders"
            aria-label="My Orders"
            className="hover:text-accent transition-colors"
            title="My Orders"
          >
            <IconPackage className="size-5" />
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <Link
            href="/sign-in"
            className="text-sm font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
        </SignedOut>

        <CartButton className="relative hover:text-accent transition-colors" />
      </div>
    </Container>
  );
};
