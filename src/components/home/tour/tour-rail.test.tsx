import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TourRail } from "./tour-rail";
import { TOUR_SCENES } from "@/mocks/tour";

describe("TourRail", () => {
  it("exposes one labelled anchor per scene inside a named nav", () => {
    render(<TourRail />);
    const nav = screen.getByRole("navigation", { name: "Café tour" });
    expect(nav).toBeInTheDocument();
    for (const scene of TOUR_SCENES) {
      const link = screen.getByRole("link", { name: scene.label });
      expect(link).toHaveAttribute("href", `#${scene.id}`);
    }
  });
});
