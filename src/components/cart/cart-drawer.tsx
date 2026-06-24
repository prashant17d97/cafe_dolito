"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useUiStore } from "@/store/ui.store";
import { useCart } from "@/features/use-cart";
import { formatPrice } from "@/lib/format";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartLine } from "./cart-line";

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const { items, subtotal, count } = useCart();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-lg">
            Your order{count > 0 ? ` · ${count} item${count === 1 ? "" : "s"}` : ""}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">Your order is empty.</p>
            <Button asChild onClick={close}>
              <Link href="/menu">Browse the menu</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <CartLine key={item.key} item={item} onNavigate={close} />
              ))}
            </div>
            <div className="space-y-4 border-t border-border px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-mono text-base font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes, delivery &amp; tip calculated at checkout.</p>
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={close}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" onClick={close}>
                  <Link href="/cart">View full cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
