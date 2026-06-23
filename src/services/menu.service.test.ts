import { describe, expect, it } from "vitest";
import { menuService } from "./menu";

describe("menuService", () => {
  it("lists paginated items", async () => {
    const page = await menuService.list({ page: 1 });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.total).toBeGreaterThanOrEqual(page.items.length);
  });
  it("filters by cuisine", async () => {
    const page = await menuService.list({ cuisine: ["fusion"] });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((i) => i.cuisine === "fusion")).toBe(true);
  });
  it("gets an item by slug", async () => {
    const first = (await menuService.list({})).items[0];
    expect((await menuService.getBySlug(first.slug))?.id).toBe(first.id);
  });
});
