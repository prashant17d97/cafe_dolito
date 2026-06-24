"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/use-cart";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/common/container";
import { CartLine } from "@/components/cart/cart-line";
import { Button } from "@/components/ui/button";

export function CartView() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground/40" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">Your order is empty</h1>
        <p className="mt-2 text-muted-foreground">Add a few dishes and they will show up here.</p>
        <Button asChild className="mt-6">
          <Link href="/menu">Browse the menu</Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Your order</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <CartLine key={item.key} item={item} />
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Taxes, delivery &amp; tip calculated at checkout.</p>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Checkout</Link>
          </Button>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/menu">Add more</Link>
          </Button>
        </aside>
      </div>
    </Container>
  );
}
