import { describe, expect, it } from "vitest";
import { parallaxProgress } from "./use-parallax";
const rect = (top: number, height: number) => ({ top, height, bottom: top + height } as DOMRect);
describe("parallaxProgress", () => {
  it("is 0 when stage top aligns with viewport top", () => { expect(parallaxProgress(rect(0, 1000), 800)).toBeCloseTo(0); });
  it("approaches 1 as the stage scrolls past", () => { expect(parallaxProgress(rect(-200, 1000), 800)).toBeGreaterThan(0); });
  it("clamps to [0,1]", () => {
    expect(parallaxProgress(rect(-100000, 1000), 800)).toBe(1);
    expect(parallaxProgress(rect(100000, 1000), 800)).toBe(0);
  });
});
