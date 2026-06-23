import { describe, expect, it } from "vitest";
import { parseProductQuery, toggleCsv, hasActiveFilters } from "./catalog-params";

describe("catalog-params", () => {
  it("parses cuisine + dietary CSV and sort", () => {
    const sp = new URLSearchParams("cuisine=indian,fusion&dietary=veg&sort=rating&q=chai&page=2");
    const q = parseProductQuery(sp);
    expect(q.cuisine).toEqual(["indian", "fusion"]);
    expect(q.dietary).toEqual(["veg"]);
    expect(q.sort).toBe("rating");
    expect(q.q).toBe("chai");
    expect(q.page).toBe(2);
  });
  it("toggles a CSV value", () => {
    expect(toggleCsv("a,b", "b")).toBe("a");
    expect(toggleCsv("a", "b")).toBe("a,b");
  });
  it("detects active filters", () => {
    expect(hasActiveFilters({ cuisine: ["indian"] })).toBe(true);
    expect(hasActiveFilters({})).toBe(false);
  });
  it("treats spiceMax (including 0) and q as active filters", () => {
    expect(hasActiveFilters({ spiceMax: 0 })).toBe(true);
    expect(hasActiveFilters({ spiceMax: 2 })).toBe(true);
    expect(hasActiveFilters({ q: "chai" })).toBe(true);
  });
  it("drops unknown cuisine/dietary values and invalid spiceMax", () => {
    const q = parseProductQuery(new URLSearchParams("cuisine=indian,garbage&dietary=veg,nonsense&spiceMax=99"));
    expect(q.cuisine).toEqual(["indian"]);
    expect(q.dietary).toEqual(["veg"]);
    expect(q.spiceMax).toBeUndefined();
  });
});
