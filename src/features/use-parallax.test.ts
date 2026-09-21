import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { parallaxProgress, useParallax } from "./use-parallax";
import { render } from "@testing-library/react";
import { useRef, createElement } from "react";

const rect = (top: number, height: number) => ({ top, height, bottom: top + height } as DOMRect);
describe("parallaxProgress", () => {
  it("is 0 when stage top aligns with viewport top", () => { expect(parallaxProgress(rect(0, 1000), 800)).toBeCloseTo(0); });
  it("approaches 1 as the stage scrolls past", () => { expect(parallaxProgress(rect(-200, 1000), 800)).toBeGreaterThan(0); });
  it("clamps to [0,1]", () => {
    expect(parallaxProgress(rect(-100000, 1000), 800)).toBe(1);
    expect(parallaxProgress(rect(100000, 1000), 800)).toBe(0);
  });
});

describe("useParallax", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("pins --p and --p-eased to 0 under prefers-reduced-motion", () => {
    // Override matchMedia to report reduced motion
    window.matchMedia = (query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    });

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useParallax(ref as React.RefObject<HTMLElement | null>);
      return createElement("div", { ref });
    };

    const { container } = render(createElement(TestComponent));
    const el = container.querySelector("div")!;

    expect(el.style.getPropertyValue("--p")).toBe("0");
    expect(el.style.getPropertyValue("--p-eased")).toBe("0");
  });
});
