import type { Address, CartItem, Contact, Fulfillment, Order } from "@/types";
import { calcTotals } from "@/lib/pricing";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:orders";

interface CreateOrderInput {
  items: CartItem[]; fulfillment: Fulfillment; slot?: string;
  address?: Address; contact: Contact; tip?: number; promoCode?: string;
}

export const orderService = {
  async create(input: CreateOrderInput): Promise<Order> {
    const all = readJSON<Order[]>(KEY, []);
    const n = 1001 + all.length;
    const order: Order = {
      id: `o-${n}`,
      code: `CD-${n}`,
      items: input.items,
      fulfillment: input.fulfillment,
      slot: input.slot,
      address: input.address,
      contact: input.contact,
      totals: calcTotals({ items: input.items, fulfillment: input.fulfillment, tip: input.tip, promoCode: input.promoCode }),
      promoCode: input.promoCode,
      status: "received",
      placedAt: new Date().toISOString(),
    };
    writeJSON(KEY, [order, ...all]);
    return withDelay(order, 300);
  },
  async list(): Promise<Order[]> { return withDelay(readJSON<Order[]>(KEY, [])); },
  async get(id: string): Promise<Order | undefined> {
    return withDelay(readJSON<Order[]>(KEY, []).find((o) => o.id === id));
  },
};
