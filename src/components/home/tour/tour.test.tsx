import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TOUR_SCENES } from "@/mocks/tour";

vi.mock("next/image", () => ({
  default: ({ alt = "", src }: { alt?: string; src: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === "string" ? src : ""} />,
}));

import { Tour } from "./tour";

describe("Tour", () => {
  it("carries exactly one h1", () => {
    render(<Tour />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(TOUR_SCENES[0].title);
  });

  it("renders every scene's copy without any IntersectionObserver", () => {
    // No IO stub: proves the narrative is real server-rendered text and is not
    // gated behind motion or visibility detection.
    render(<Tour />);
    for (const scene of TOUR_SCENES) {
      expect(screen.getByText(scene.title)).toBeInTheDocument();
      expect(screen.getByText(scene.body)).toBeInTheDocument();
    }
  });

  it("gives every rail link a scene section to land on", () => {
    const { container } = render(<Tour />);
    for (const scene of TOUR_SCENES) {
      const link = screen.getByRole("link", { name: scene.label });
      const href = link.getAttribute("href")!;
      expect(container.querySelector(href)).not.toBeNull();
    }
  });

  it("offers a keyboard bypass past the tour", () => {
    render(<Tour />);
    expect(screen.getByRole("link", { name: /skip the tour/i })).toHaveAttribute(
      "href",
      "#after-tour",
    );
  });
});
