import { describe, expect, it, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "./recently-viewed.store";

const rv = () => useRecentlyViewedStore.getState();

describe("recently-viewed.store", () => {
  beforeEach(() => useRecentlyViewedStore.setState({ ids: [] }));
  it("dedupes and moves the id to the front", () => {
    rv().push("a"); rv().push("b"); rv().push("a");
    expect(rv().ids).toEqual(["a", "b"]);
  });
  it("caps history at 8", () => {
    for (let i = 0; i < 12; i++) rv().push(`x${i}`);
    expect(rv().ids).toHaveLength(8);
  });
});
