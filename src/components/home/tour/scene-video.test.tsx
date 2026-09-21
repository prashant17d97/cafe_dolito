import { render } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { SceneBar } from "./scene-bar";

vi.mock("next/image", () => ({
  default: ({ alt = "", src }: { alt?: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === "string" ? src : ""} />
  ),
}));

const CUP_ALT = "An espresso pulled to a thick hazelnut crema";

/**
 * src/test/setup.ts installs a global matchMedia that always reports
 * matches:false, so SceneVideo's motionOk flips true in every other suite and
 * the reduced-motion branch — the "no video under reduced motion" promise —
 * was covered by nothing. Swap the stub per test and put it back afterwards;
 * leaking a matches:true stub would break every suite that renders a stage.
 */
const realMatchMedia = window.matchMedia;

function stubReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = realMatchMedia;
});

describe("SceneVideo", () => {
  it("mounts no <video> under prefers-reduced-motion, leaving the still as the layer", () => {
    stubReducedMotion(true);
    const { container } = render(<SceneBar />);

    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector(`img[alt="${CUP_ALT}"]`)).not.toBeNull();
  });

  it("layers the clip OVER the still rather than replacing it when motion is allowed", () => {
    stubReducedMotion(false);
    const { container } = render(<SceneBar />);

    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    // The point of the layered structure: the optimised still stays in the DOM,
    // so there is no cold poster fetch and the alt text survives hydration.
    expect(container.querySelector(`img[alt="${CUP_ALT}"]`)).not.toBeNull();
    // No poster: a raw /tour/*.jpg poster bypasses next/image entirely.
    expect(video!.hasAttribute("poster")).toBe(false);
  });
});
