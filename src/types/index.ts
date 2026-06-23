export type ID = string;

export type ItemType = "drink" | "food" | "bean";
export type Cuisine = "cafe" | "italian" | "indian" | "fusion";
export type SpiceLevel = 0 | 1 | 2 | 3; // none → hot
export type DietaryTag =
  | "veg" | "vegan" | "gluten-free" | "contains-nuts" | "halal"
  | "spicy" | "chefs-special" | "seasonal" | "bestseller" | "new";

export interface ItemOptionValue { id: ID; label: string; priceDelta: number; }
export interface ItemOption {
  id: ID;
  name: string;
  type: "single" | "multi";
  required?: boolean;
  values: ItemOptionValue[];
}
export interface ItemImage { src: string; alt: string; }

export interface MenuItem {
  id: ID;
  slug: string;
  name: string;
  description: string;
  type: ItemType;
  cuisine: Cuisine;
  categorySlug: string;
  collectionSlugs: ID[];
  price: number;
  images: ItemImage[];
  options: ItemOption[];
  dietary: DietaryTag[];
  spice?: SpiceLevel;
  veg?: boolean;
  rating?: number;
  reviewCount?: number;
  prepTimeMins?: number;
  calories?: number;
  available?: boolean;
}

export interface CartSelection {
  optionId: ID; optionName: string; valueId: ID; valueLabel: string; priceDelta: number;
}
export interface CartItem {
  key: string;            // itemId + sorted value ids
  itemId: ID;
  slug: string;
  name: string;
  image: string;
  cuisine: Cuisine;
  unitPrice: number;      // base + selected deltas
  selections: CartSelection[];
  quantity: number;
  maxQty: number;
  notes?: string;
}

export interface Category { slug: string; name: string; cuisine: Cuisine; blurb?: string; image?: string; }
export interface Collection { slug: string; name: string; tagline: string; image: string; itemIds: ID[]; }
export interface Review { id: ID; itemSlug?: string; author: string; rating: number; body: string; date: string; }

export interface Address { line1: string; line2?: string; city: string; state: string; zip: string; }
export interface Contact { name: string; email: string; phone: string; }

export interface MockUser { id: ID; firstName: string; lastName: string; email: string; password: string; }
export interface SessionUser { id: ID; firstName: string; lastName: string; email: string; }

export type Fulfillment = "pickup" | "delivery";
export type OrderStatus = "received" | "preparing" | "ready" | "completed";
export interface OrderTotals {
  subtotal: number; tax: number; deliveryFee: number; tip: number; discount: number; total: number;
}
export interface Order {
  id: ID; code: string; items: CartItem[]; fulfillment: Fulfillment;
  slot?: string; address?: Address; contact: Contact; totals: OrderTotals;
  promoCode?: string; status: OrderStatus; placedAt: string;
}

export type ReservationStatus = "confirmed" | "seated" | "cancelled" | "completed";
export interface Reservation {
  id: ID; reference: string; date: string; timeSlot: string; partySize: number;
  name: string; email: string; phone: string; occasion?: string; notes?: string;
  status: ReservationStatus; createdAt: string;
}

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";
export interface ProductQuery {
  cuisine?: Cuisine[]; category?: string; dietary?: DietaryTag[];
  spiceMax?: SpiceLevel; sort?: SortKey; q?: string; page?: number;
}
export interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number; }

/** Weekly opening hours: index 0 = Sunday … 6 = Saturday. null = closed that day. */
export interface DayHours { open: string; close: string; } // "07:00", "22:00"
export type Hours = (DayHours | null)[];
