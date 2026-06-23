import type { ItemOption, MenuItem } from "@/types";
import { unsplash } from "./images";

let seq = 0;

/** Common option sets reused across items. */
export const OPTIONS = {
  drinkSize: {
    id: "size", name: "Size", type: "single", required: true,
    values: [
      { id: "s", label: "Small", priceDelta: 0 },
      { id: "m", label: "Medium", priceDelta: 0.75 },
      { id: "l", label: "Large", priceDelta: 1.5 },
    ],
  } satisfies ItemOption,
  milk: {
    id: "milk", name: "Milk", type: "single",
    values: [
      { id: "whole", label: "Whole", priceDelta: 0 },
      { id: "oat", label: "Oat", priceDelta: 0.6 },
      { id: "almond", label: "Almond", priceDelta: 0.6 },
    ],
  } satisfies ItemOption,
  spiceChoice: {
    id: "spice", name: "Spice", type: "single",
    values: [
      { id: "mild", label: "Mild", priceDelta: 0 },
      { id: "medium", label: "Medium", priceDelta: 0 },
      { id: "hot", label: "Hot", priceDelta: 0 },
    ],
  } satisfies ItemOption,
  grind: {
    id: "grind", name: "Grind", type: "single", required: true,
    values: [
      { id: "whole", label: "Whole bean", priceDelta: 0 },
      { id: "espresso", label: "Espresso", priceDelta: 0 },
      { id: "filter", label: "Filter", priceDelta: 0 },
    ],
  } satisfies ItemOption,
  weight: {
    id: "weight", name: "Weight", type: "single", required: true,
    values: [
      { id: "250", label: "250g", priceDelta: 0 },
      { id: "500", label: "500g", priceDelta: 7 },
      { id: "1000", label: "1kg", priceDelta: 13 },
    ],
  } satisfies ItemOption,
} as const;

export function makeItem(p: Partial<MenuItem> & Pick<MenuItem, "name" | "cuisine" | "categorySlug" | "price">): MenuItem {
  seq += 1;
  const slug = p.slug ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const imageId = p.images?.[0]?.src ?? unsplash("photo-1495474472287-4d71bcdd2085");
  return {
    id: p.id ?? `cd-${seq}`,
    slug,
    name: p.name,
    description: p.description ?? "",
    type: p.type ?? "food",
    cuisine: p.cuisine,
    categorySlug: p.categorySlug,
    collectionSlugs: p.collectionSlugs ?? [],
    price: p.price,
    images: p.images ?? [{ src: imageId, alt: p.name }],
    options: p.options ?? [],
    dietary: p.dietary ?? [],
    spice: p.spice,
    veg: p.veg,
    rating: p.rating ?? 4.6,
    reviewCount: p.reviewCount ?? 24,
    prepTimeMins: p.prepTimeMins,
    calories: p.calories,
    available: p.available ?? true,
  };
}
