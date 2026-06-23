import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.key === item.key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === item.key ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQty) } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: Math.min(item.quantity, item.maxQty) }] };
        }),
      setQty: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQty)) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: "cd:cart" },
  ),
);

export const selectCartItems = (s: CartState) => s.items;
export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
