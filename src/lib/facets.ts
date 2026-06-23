import type { Cuisine, DietaryTag, MenuItem } from "@/types";

export interface Facets {
  cuisines: Cuisine[];
  categories: string[];
  dietary: DietaryTag[];
  priceRange: { min: number; max: number };
}

export function buildFacets(items: MenuItem[]): Facets {
  const cuisines = new Set<Cuisine>();
  const categories = new Set<string>();
  const dietary = new Set<DietaryTag>();
  let min = Infinity, max = -Infinity;
  for (const i of items) {
    cuisines.add(i.cuisine);
    categories.add(i.categorySlug);
    i.dietary.forEach((d) => dietary.add(d));
    min = Math.min(min, i.price);
    max = Math.max(max, i.price);
  }
  return {
    cuisines: [...cuisines],
    categories: [...categories],
    dietary: [...dietary],
    priceRange: { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 },
  };
}
