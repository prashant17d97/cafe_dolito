import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SceneTable } from "./scene-table";
import { SceneKitchen } from "./scene-kitchen";
import { SceneBar } from "./scene-bar";
import { SceneRoast } from "./scene-roast";

vi.mock("next/image", () => ({
  default: ({ alt = "", src }: { alt?: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === "string" ? src : ""} />
  ),
}));

/**
 * useParallax pins --p and --p-eased to "0" under prefers-reduced-motion and
 * never updates them again, so any element authored to fade/wipe IN as
 * progress rises renders at its invisible progress-0 frame forever. jsdom
 * cannot evaluate the prefers-reduced-motion media query itself (see
 * tour-stage.test.tsx), so the honest assertion here is that each affected
 * element carries a motion-reduce escape class.
 *
 * That alone isn't enough, though: Tailwind v4's `translate-x-*`/`translate-y-*`
 * utilities compile to the standalone CSS `translate` property, not `transform`.
 * Per CSS Transforms Level 2, `translate` and `transform` are independent and
 * compose rather than override — so a `motion-reduce:translate-x-0!` class sat
 * next to an inline `style.transform` and did nothing; the inline transform
 * still won. A class-presence-only assertion stayed green through that bug.
 *
 * assertEscapeTargetsSameProperty enforces the real invariant: whatever CSS
 * property the inline style sets, the motion-reduce escape class must target
 * THAT SAME property (transform, opacity, or clip-path) — not a same-effect
 * sibling property. That's what makes reintroducing `translate-x-0`/
 * `translate-y-0` in place of an arbitrary `[transform:...]` override fail.
 */
function assertEscapeTargetsSameProperty(el: HTMLElement, label: string) {
  const cls = el.className;

  if (el.style.transform) {
    expect(cls, `${label}: inline style sets transform, so the escape must target transform`).toMatch(
      /motion-reduce:\S*transform\S*!/
    );
  }
  if (el.style.opacity) {
    expect(cls, `${label}: inline style sets opacity, so the escape must target opacity`).toMatch(
      /motion-reduce:opacity-100!/
    );
  }
  if (el.style.clipPath) {
    expect(cls, `${label}: inline style sets clip-path, so the escape must target clip-path`).toMatch(
      /motion-reduce:\S*clip-path\S*!/
    );
  }
}

/**
 * Find a scene's media layer by its accessible text. The layer renders as an
 * <img> (the still, and always under reduced motion) or as a <video> once
 * SceneVideo swaps in on the client — the assertions below are about the
 * WRAPPER's escape classes either way, so the lookup must accept both.
 */
function mediaByLabel(container: HTMLElement, label: string): HTMLElement {
  const el = container.querySelector(
    `img[alt="${label}"], video[aria-label="${label}"]`,
  );
  if (!el) throw new Error(`no <img>/<video> found for label: ${label}`);
  return el as HTMLElement;
}

describe("reduced-motion escapes on meaningful tour content", () => {
  it("SceneTable: closing copy + CTA wrapper is forced fully visible and untranslated", () => {
    const { container } = render(<SceneTable />);
    const wrapper = container.querySelector("h2")!.parentElement!;
    expect(wrapper.className).toContain("motion-reduce:opacity-100!");
    assertEscapeTargetsSameProperty(wrapper, "SceneTable copy/CTA wrapper");
  });

  it("SceneTable: plate stays untransformed instead of stuck at scale(1.45)", () => {
    const { container } = render(<SceneTable />);
    const plateAlt = "A shared plate and an espresso on the marble, hands reaching in";
    const plateImg = mediaByLabel(container, plateAlt);
    const plateWrapper = plateImg.parentElement!;
    expect(plateWrapper.className).toContain("motion-reduce:opacity-100!");
    assertEscapeTargetsSameProperty(plateWrapper, "SceneTable plate wrapper");
  });

  it("SceneRoast: mid-scene copy wrapper is untranslated instead of stuck +20px", () => {
    const { container } = render(<SceneRoast />);
    const wrapper = container.querySelector("h2")!.parentElement!;
    assertEscapeTargetsSameProperty(wrapper, "SceneRoast copy wrapper");
  });

  it("SceneBar: mid-scene copy wrapper is untranslated instead of stuck +20px", () => {
    const { container } = render(<SceneBar />);
    const wrapper = container.querySelector("h2")!.parentElement!;
    assertEscapeTargetsSameProperty(wrapper, "SceneBar copy wrapper");
  });

  it("SceneKitchen: fusion plate is forced fully visible and the two planes close to the seam", () => {
    const { container } = render(<SceneKitchen />);
    const fusionAlt = "Paccheri in a spiced masala sauce, finished with basil and coriander";
    const fusionImg = mediaByLabel(container, fusionAlt);
    const fusionWrapper = fusionImg.parentElement!;
    expect(fusionWrapper.className).toContain("motion-reduce:opacity-100!");
    assertEscapeTargetsSameProperty(fusionWrapper, "SceneKitchen fusion plate wrapper");

    const planes = container.querySelectorAll("div.absolute.inset-y-0");
    expect(planes.length).toBe(2);
    planes.forEach((plane, i) => {
      assertEscapeTargetsSameProperty(plane as HTMLElement, `SceneKitchen plane ${i}`);
    });

    const copyWrapper = container.querySelector("h2")!.parentElement!;
    assertEscapeTargetsSameProperty(copyWrapper, "SceneKitchen copy wrapper");
  });

  it("SceneBar: espresso cup clip-path is forced fully open", () => {
    const { container } = render(<SceneBar />);
    const cupAlt = "An espresso pulled to a thick hazelnut crema";
    const cupImg = mediaByLabel(container, cupAlt);
    const clipWrapper = cupImg.parentElement!;
    expect(clipWrapper.className).toContain("motion-reduce:[clip-path:inset(0)]!");
    assertEscapeTargetsSameProperty(clipWrapper, "SceneBar cup clip wrapper");
  });
});
