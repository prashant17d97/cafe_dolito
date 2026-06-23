import { describe, expect, it, beforeEach } from "vitest";
import { useFavoritesStore } from "./favorites.store";

const fav = () => useFavoritesStore.getState();

describe("favorites.store", () => {
  beforeEach(() => useFavoritesStore.setState({ ids: [] }));
  it("toggles an id on and off", () => {
    fav().toggle("x"); expect(fav().has("x")).toBe(true);
    fav().toggle("x"); expect(fav().has("x")).toBe(false);
  });
});
