import { describe, expect, it } from "vitest";
import { ITEMS, getItem } from "./index";
import { CATEGORIES } from "../categories";

describe("mock items", () => {
  it("has a healthy catalog size", () => { expect(ITEMS.length).toBeGreaterThanOrEqual(35); });
  it("has unique slugs", () => { expect(new Set(ITEMS.map((i) => i.slug)).size).toBe(ITEMS.length); });
  it("references only known categories", () => {
    const known = new Set(CATEGORIES.map((c) => c.slug));
    expect(ITEMS.every((i) => known.has(i.categorySlug))).toBe(true);
  });
  it("covers all four cuisines", () => {
    expect(new Set(ITEMS.map((i) => i.cuisine))).toEqual(new Set(["cafe", "italian", "indian", "fusion"]));
  });
  it("looks items up by slug", () => { expect(getItem(ITEMS[0].slug)?.id).toBe(ITEMS[0].id); });
});
