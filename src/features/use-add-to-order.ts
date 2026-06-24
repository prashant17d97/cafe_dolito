"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import type { CartItem } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

/**
 * Returns an `addToOrder` action that ordering is gated behind auth: guests are
 * sent to sign in (returning to where they were), members add to the cart.
 */
export function useAddToOrder() {
  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  return function addToOrder(cartItem: CartItem, name: string) {
    // Read fresh state at click time — always current, no hydration race.
    if (!useAuthStore.getState().user) {
      toast.info("Please sign in to start an order.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    addItem(cartItem);
    setCartOpen(true);
    toast.success(`${name} added to your order`);
  };
}
