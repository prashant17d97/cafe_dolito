import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BasilLeaf, Marigold } from "./motifs";

describe("brand motifs", () => {
  it("renders every motif and forwards className", () => {
    const motifs = [BasilLeaf, Marigold];
    for (const Motif of motifs) {
      const { container, unmount } = render(<Motif className="test-hook" />);
      expect(container.querySelector(".test-hook")).not.toBeNull();
      unmount();
    }
  });

  it("marks motifs as decorative for assistive tech", () => {
    const { container } = render(<BasilLeaf />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden");
  });
});
