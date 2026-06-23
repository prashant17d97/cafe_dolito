import { describe, expect, it } from "vitest";
import { buildFacets } from "./facets";
import type { MenuItem } from "@/types";

function item(over: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "1", slug: "s", name: "x", description: "", type: "food", cuisine: "italian",
    categorySlug: "pasta", collectionSlugs: [], price: 10, images: [], options: [], dietary: [], ...over,
  };
}

describe("buildFacets", () => {
  const f = buildFacets([
    item({ cuisine: "italian", categorySlug: "pasta", price: 10, dietary: ["veg"] }),
    item({ cuisine: "indian", categorySlug: "curries", price: 18, dietary: ["spicy", "veg"] }),
  ]);
  it("collects unique cuisines", () => { expect(f.cuisines.sort()).toEqual(["indian", "italian"]); });
  it("collects unique categories", () => { expect(f.categories.sort()).toEqual(["curries", "pasta"]); });
  it("collects unique dietary tags", () => { expect(f.dietary.sort()).toEqual(["spicy", "veg"]); });
  it("computes price range", () => { expect(f.priceRange).toEqual({ min: 10, max: 18 }); });
});
