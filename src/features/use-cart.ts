"use client";

import type { CartItem, CartSelection, MenuItem } from "@/types";
import { useCartStore, selectCartItems } from "@/store/cart.store";
import { calcSubtotal } from "@/lib/pricing";

const MAX_QTY = 20;

/** Build a canonical CartItem from a menu item + chosen option values (defaults to each option's first value). */
export function buildCartItem(
  item: MenuItem,
  selectedValueIds: Record<string, string> = {},
  quantity = 1,
): CartItem {
  const selections: CartSelection[] = item.options.map((opt) => {
    const wanted = selectedValueIds[opt.id];
    const value = opt.values.find((v) => v.id === wanted) ?? opt.values[0];
    return {
      optionId: opt.id,
      optionName: opt.name,
      valueId: value.id,
      valueLabel: value.label,
      priceDelta: value.priceDelta,
    };
  });
  const unitPrice = item.price + selections.reduce((sum, s) => sum + s.priceDelta, 0);
  const key = [item.id, ...selections.map((s) => s.valueId).sort()].join("|");
  return {
    key,
    itemId: item.id,
    slug: item.slug,
    name: item.name,
    image: item.images[0]?.src ?? "",
    cuisine: item.cuisine,
    unitPrice: Math.round(unitPrice * 100) / 100,
    selections,
    quantity,
    maxQty: MAX_QTY,
  };
}

/** Convenience facade over the cart store for client components. */
export function useCart() {
  const items = useCartStore(selectCartItems);
  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = calcSubtotal(items);

  function add(item: MenuItem, selectedValueIds: Record<string, string> = {}, quantity = 1) {
    addItem(buildCartItem(item, selectedValueIds, quantity));
  }

  return { items, count, subtotal, add, setQty, remove, clear };
}
