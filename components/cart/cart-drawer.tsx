"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-item";
import {
  useCartItems,
  useCartIsOpen,
  useTotalPrice,
  useCartActions,
} from "@/lib/store/cart-store-provider";
import { IconX, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

export function CartDrawer() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalPrice = useTotalPrice();
  const { closeCart } = useCartActions();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-lg font-light tracking-tight">Your Cart</h2>
              <button
                type="button"
                onClick={closeCart}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <IconX className="size-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <IconShoppingBag className="size-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-light text-foreground mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add some luxury pieces to get started
                  </p>
                  <Button variant="outline" onClick={closeCart} asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-2">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-[Inter,sans-serif] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-lg font-light text-foreground">
                    {totalPrice.toLocaleString("pl-PL")} zł
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-[Inter,sans-serif]">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Button className="w-full h-12" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                  </Link>
                </Button>

                {/* Continue Shopping */}
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-center text-sm font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
