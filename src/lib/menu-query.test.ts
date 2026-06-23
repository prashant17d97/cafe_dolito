import { describe, expect, it } from "vitest";
import { filterItems, sortItems, paginate, DEFAULT_PAGE_SIZE } from "./menu-query";
import type { MenuItem } from "@/types";

function item(over: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "1", slug: "s", name: "Item", description: "", type: "food", cuisine: "italian",
    categorySlug: "pasta", collectionSlugs: [], price: 10, images: [], options: [],
    dietary: [], ...over,
  };
}

describe("menu-query", () => {
  const items = [
    item({ id: "1", cuisine: "italian", price: 10, rating: 4.2, dietary: ["veg"] }),
    item({ id: "2", cuisine: "indian", price: 6, rating: 4.9, dietary: ["spicy"], spice: 3 }),
    item({ id: "3", cuisine: "fusion", price: 14, rating: 4.5, dietary: ["new"] }),
  ];
  it("filters by cuisine", () => { expect(filterItems(items, { cuisine: ["indian"] }).map((i) => i.id)).toEqual(["2"]); });
  it("filters by dietary", () => { expect(filterItems(items, { dietary: ["veg"] }).map((i) => i.id)).toEqual(["1"]); });
  it("filters by spiceMax", () => { expect(filterItems(items, { spiceMax: 1 }).every((i) => (i.spice ?? 0) <= 1)).toBe(true); });
  it("searches by query text", () => {
    expect(filterItems([item({ name: "Masala Arrabbiata" })], { q: "masala" })).toHaveLength(1);
  });
  it("sorts price ascending", () => { expect(sortItems(items, "price-asc").map((i) => i.id)).toEqual(["2", "1", "3"]); });
  it("sorts rating", () => { expect(sortItems(items, "rating")[0].id).toBe("2"); });
  it("paginates", () => {
    const page = paginate(items, 1, 2);
    expect(page.items).toHaveLength(2);
    expect(page.total).toBe(3);
  });
  it("has a default page size", () => { expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0); });
  it("AND-combines multiple dietary tags", () => {
    const list = [item({ id: "a", dietary: ["veg", "spicy"] }), item({ id: "b", dietary: ["veg"] })];
    expect(filterItems(list, { dietary: ["veg", "spicy"] }).map((i) => i.id)).toEqual(["a"]);
  });
  it("excludes unavailable items", () => {
    const list = [item({ id: "x", available: false }), item({ id: "y" })];
    expect(filterItems(list, {}).map((i) => i.id)).toEqual(["y"]);
  });
});
