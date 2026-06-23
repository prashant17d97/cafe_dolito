import { describe, expect, it, vi } from "vitest";
import { readJSON, writeJSON, removeKey } from "./storage";

describe("storage", () => {
  it("returns fallback when key missing", () => { expect(readJSON("nope", 42)).toBe(42); });
  it("round-trips a value", () => {
    writeJSON("k", { a: 1 });
    expect(readJSON("k", null)).toEqual({ a: 1 });
  });
  it("removes a key", () => {
    writeJSON("k2", 1); removeKey("k2");
    expect(readJSON("k2", "gone")).toBe("gone");
  });
  it("is SSR-safe when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(readJSON("k", "fallback")).toBe("fallback");
    expect(() => writeJSON("k", 1)).not.toThrow();
    expect(() => removeKey("k")).not.toThrow();
    vi.unstubAllGlobals();
  });
});
