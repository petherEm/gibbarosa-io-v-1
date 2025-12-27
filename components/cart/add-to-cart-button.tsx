"use client";

import { Button } from "@/components/ui/button";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { IconShoppingBag, IconCheck } from "@tabler/icons-react";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string | null;
    price: number | null;
    slug: string | null;
    image?: string | null;
  };
  stock: number;
  className?: string;
}

export function AddToCartButton({
  product,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartActions();
  const cartItem = useCartItem(product._id);

  const isOutOfStock = stock <= 0;
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    if (isOutOfStock || isInCart) return;

    addItem({
      productId: product._id,
      name: product.name ?? "Product",
      price: product.price ?? 0,
      image: product.image ?? undefined,
    });
    openCart();
  };

  if (isOutOfStock) {
    return (
      <Button size="lg" className={className} disabled variant="secondary">
        Gone Forever
      </Button>
    );
  }

  if (isInCart) {
    return (
      <Button size="lg" className={className} variant="secondary" onClick={openCart}>
        <IconCheck className="mr-2 size-5" />
        In Cart
      </Button>
    );
  }

  return (
    <Button size="lg" className={className} onClick={handleAddToCart}>
      <IconShoppingBag className="mr-2 size-5" />
      Add to Cart
    </Button>
  );
}
