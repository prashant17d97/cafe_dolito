import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TourStage } from "./tour-stage";

describe("TourStage", () => {
  it("renders its children inside a labelled section with the given id", () => {
    render(<TourStage id="door" label="The door"><p>scene content</p></TourStage>);
    const section = screen.getByRole("region", { name: "The door" });
    expect(section).toHaveAttribute("id", "door");
    expect(screen.getByText("scene content")).toBeInTheDocument();
  });

  it("collapses out of the pinned layout under reduced motion", () => {
    const { container } = render(<TourStage id="roast" label="The counter"><p>x</p></TourStage>);
    const section = container.querySelector("section")!;
    const viewport = section.firstElementChild!;
    // The tall scroll runway and the pin both have reduced-motion escapes.
    expect(section.className).toContain("motion-reduce:h-auto");
    expect(section.className).toContain("motion-reduce:min-h-[60vh]");
    expect(section.className).toContain("motion-reduce:overflow-hidden");
    expect(viewport.className).toContain("motion-reduce:static");
    expect(viewport.className).toContain("h-svh");
  });
});
