import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Reveal } from "./reveal";

// jsdom lacks IntersectionObserver; stub it so the component's undefined-guard
// path (setVisible(true)) is bypassed only when we want to test the observer path.
// For this smoke test we rely on the undefined-guard instead.
beforeEach(() => {
  // Remove any stub so the component hits the "undefined" guard and shows immediately
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("renders children", () => {
    render(
      <Reveal>
        <p>hi</p>
      </Reveal>
    );
    expect(screen.getByText("hi")).toBeInTheDocument();
  });

  it("renders children with a custom tag", () => {
    render(
      <Reveal as="section">
        <p>section child</p>
      </Reveal>
    );
    expect(screen.getByText("section child")).toBeInTheDocument();
  });

  it("becomes visible when it intersects the viewport", () => {
    let captured: IntersectionObserverCallback | undefined;
    class MockIO {
      constructor(cb: IntersectionObserverCallback) { captured = cb; }
      observe() {
        captured?.([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
    }
    vi.stubGlobal("IntersectionObserver", MockIO as unknown as typeof IntersectionObserver);

    let container: HTMLElement;
    act(() => {
      const result = render(<Reveal>shown content</Reveal>);
      container = result.container;
    });

    expect(screen.getByText("shown content")).toBeInTheDocument();
    expect(container!.firstChild).toHaveClass("opacity-100");
    vi.unstubAllGlobals();
  });
});
