import type { CartItem, Fulfillment, OrderTotals } from "@/types";

export const TAX_RATE = 0.0875;
export const DELIVERY_FEE = 4.99;
export const FREE_DELIVERY_THRESHOLD = 40;
export const TIP_PRESETS = [0.1, 0.15, 0.2] as const;

/** Flat percentage-off promo codes. */
export const PROMO_CODES: Record<string, number> = {
  BREW10: 0.1,
  MORNING15: 0.15,
  BEANS20: 0.2,
  DOLITO25: 0.25,
};

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function calcDelivery(subtotal: number, fulfillment: Fulfillment): number {
  if (fulfillment === "pickup") return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function resolveDiscount(subtotal: number, code?: string): number {
  if (!code) return 0;
  const pct = PROMO_CODES[code.toUpperCase()];
  return pct ? subtotal * pct : 0;
}

/** Round a currency amount to whole cents (guards against FP drift like 0.1 + 0.2). */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcTotals(args: {
  items: CartItem[]; fulfillment: Fulfillment; tip?: number; promoCode?: string;
}): OrderTotals {
  const subtotal = round2(calcSubtotal(args.items));
  const discount = round2(resolveDiscount(subtotal, args.promoCode));
  const deliveryFee = calcDelivery(subtotal, args.fulfillment);
  const tax = round2(subtotal * TAX_RATE);
  const tip = round2(args.tip ?? 0);
  const total = round2(subtotal - discount + deliveryFee + tax + tip);
  return { subtotal, tax, deliveryFee, tip, discount, total };
}
