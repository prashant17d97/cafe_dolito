import { describe, expect, it, beforeEach } from "vitest";
import { orderService } from "./order";
import type { CartItem } from "@/types";

const item: CartItem = {
  key: "k", itemId: "i", slug: "doppio", name: "Doppio", image: "x", cuisine: "cafe",
  unitPrice: 3.5, selections: [], quantity: 2, maxQty: 9,
};

describe("orderService", () => {
  beforeEach(() => localStorage.clear());
  it("creates an order with totals, a code and pickup status", async () => {
    const order = await orderService.create({
      items: [item], fulfillment: "pickup", slot: "08:00",
      contact: { name: "Demo", email: "d@e.com", phone: "5550142" },
    });
    expect(order.code).toMatch(/^CD-/);
    expect(order.totals.subtotal).toBe(7);
    expect(order.status).toBe("received");
  });
  it("persists and lists created orders", async () => {
    await orderService.create({ items: [item], fulfillment: "pickup", contact: { name: "D", email: "d@e.com", phone: "1" } });
    expect((await orderService.list()).length).toBe(1);
  });
  it("looks up a created order by id", async () => {
    const o = await orderService.create({ items: [item], fulfillment: "pickup", contact: { name: "D", email: "d@e.com", phone: "1" } });
    expect((await orderService.get(o.id))?.code).toBe(o.code);
  });
});
