import { describe, expect, it, beforeEach } from "vitest";
import { useCartStore, selectCartCount } from "./cart.store";
import type { CartItem } from "@/types";

function line(over: Partial<CartItem> = {}): CartItem {
  return {
    key: "doppio|m", itemId: "i", slug: "doppio", name: "Doppio", image: "x", cuisine: "cafe",
    unitPrice: 4.25, selections: [], quantity: 1, maxQty: 9, ...over,
  };
}
const cart = () => useCartStore.getState();

describe("cart.store", () => {
  beforeEach(() => cart().clear());
  it("adds a new line", () => { cart().addItem(line()); expect(cart().items).toHaveLength(1); });
  it("merges quantity for the same key", () => {
    cart().addItem(line({ quantity: 1 }));
    cart().addItem(line({ quantity: 2 }));
    expect(cart().items).toHaveLength(1);
    expect(cart().items[0].quantity).toBe(3);
  });
  it("clamps merged quantity to maxQty", () => {
    cart().addItem(line({ quantity: 7 }));
    cart().addItem(line({ quantity: 7 }));
    expect(cart().items[0].quantity).toBe(9);
  });
  it("sets and removes by key", () => {
    cart().addItem(line());
    cart().setQty("doppio|m", 5); expect(cart().items[0].quantity).toBe(5);
    cart().remove("doppio|m"); expect(cart().items).toHaveLength(0);
  });
  it("selectCartCount sums quantities", () => {
    cart().addItem(line({ key: "a", quantity: 2 }));
    cart().addItem(line({ key: "b", quantity: 3 }));
    expect(selectCartCount(cart())).toBe(5);
  });
  it("setQty floors quantity at 1", () => {
    cart().addItem(line());
    cart().setQty("doppio|m", 0);
    expect(cart().items[0].quantity).toBe(1);
  });
});
