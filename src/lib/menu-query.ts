import type { MenuItem, Paginated, ProductQuery, SortKey } from "@/types";

export const DEFAULT_PAGE_SIZE = 12;

export function filterItems(items: MenuItem[], q: ProductQuery): MenuItem[] {
  return items.filter((i) => {
    if (q.cuisine?.length && !q.cuisine.includes(i.cuisine)) return false;
    if (q.category && i.categorySlug !== q.category) return false;
    if (q.dietary?.length && !q.dietary.every((d) => i.dietary.includes(d))) return false;
    if (q.spiceMax != null && (i.spice ?? 0) > q.spiceMax) return false;
    if (q.q) {
      const hay = `${i.name} ${i.description}`.toLowerCase();
      if (!hay.includes(q.q.toLowerCase())) return false;
    }
    return true;
  });
}

const COMPARATORS: Record<SortKey, (a: MenuItem, b: MenuItem) => number> = {
  popular: (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
  newest: (a, b) => Number(b.dietary.includes("new")) - Number(a.dietary.includes("new")),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
};

export function sortItems(items: MenuItem[], sort: SortKey = "popular"): MenuItem[] {
  return [...items].sort(COMPARATORS[sort]);
}

export function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Paginated<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}
