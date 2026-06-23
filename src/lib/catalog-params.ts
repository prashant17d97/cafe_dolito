import type { Cuisine, DietaryTag, ProductQuery, SortKey } from "@/types";

const SORTS: SortKey[] = ["popular", "newest", "price-asc", "price-desc", "rating"];

export function parseProductQuery(sp: URLSearchParams): ProductQuery {
  const csv = (k: string) => (sp.get(k)?.split(",").map((s) => s.trim()).filter(Boolean) ?? []);
  const q: ProductQuery = {};
  const cuisine = csv("cuisine") as Cuisine[];
  const dietary = csv("dietary") as DietaryTag[];
  if (cuisine.length) q.cuisine = cuisine;
  if (dietary.length) q.dietary = dietary;
  if (sp.get("category")) q.category = sp.get("category")!;
  const sort = sp.get("sort") as SortKey | null;
  if (sort && SORTS.includes(sort)) q.sort = sort;
  if (sp.get("spiceMax")) q.spiceMax = Number(sp.get("spiceMax")) as ProductQuery["spiceMax"];
  if (sp.get("q")) q.q = sp.get("q")!;
  if (sp.get("page")) q.page = Math.max(1, Number(sp.get("page")) || 1);
  return q;
}

export function toggleCsv(csv: string | undefined, value: string): string {
  const set = new Set((csv ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return [...set].join(",");
}

export function hasActiveFilters(q: ProductQuery): boolean {
  return Boolean(q.cuisine?.length || q.dietary?.length || q.category || q.spiceMax != null || q.q);
}
