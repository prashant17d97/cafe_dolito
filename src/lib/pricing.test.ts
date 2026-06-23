import { describe, expect, it } from "vitest";
import {
  TAX_RATE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD,
  calcSubtotal, calcDelivery, resolveDiscount, calcTotals,
} from "./pricing";
import type { CartItem } from "@/types";

function line(over: Partial<CartItem> = {}): CartItem {
  return {
    key: "k", itemId: "i", slug: "s", name: "Latte", image: "x", cuisine: "cafe",
    unitPrice: 5, selections: [], quantity: 2, maxQty: 9, ...over,
  };
}

describe("pricing", () => {
  it("sums subtotal from unitPrice * qty", () => {
    expect(calcSubtotal([line({ unitPrice: 5, quantity: 2 }), line({ unitPrice: 3, quantity: 1 })])).toBe(13);
  });
  it("waives delivery for pickup", () => { expect(calcDelivery(10, "pickup")).toBe(0); });
  it("charges delivery under threshold", () => { expect(calcDelivery(10, "delivery")).toBe(DELIVERY_FEE); });
  it("free delivery at/over threshold", () => { expect(calcDelivery(FREE_DELIVERY_THRESHOLD, "delivery")).toBe(0); });
  it("resolves a known promo", () => { expect(resolveDiscount(100, "BREW10")).toBeCloseTo(10); });
  it("ignores unknown promo", () => { expect(resolveDiscount(100, "NOPE")).toBe(0); });
  it("computes total = subtotal + tax + delivery + tip - discount", () => {
    const t = calcTotals({ items: [line({ unitPrice: 50, quantity: 1 })], fulfillment: "pickup", tip: 5, promoCode: "BREW10" });
    const tax = Math.round(50 * TAX_RATE * 100) / 100; // money rounds to cents: 4.38
    expect(t.subtotal).toBe(50);
    expect(t.discount).toBe(5);
    expect(t.tax).toBeCloseTo(tax);
    expect(t.total).toBeCloseTo(50 - 5 + 0 + tax + 5); // 54.38
  });
});
