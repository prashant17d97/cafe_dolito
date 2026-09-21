import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useActiveScene } from "./use-active-scene";

const IDS = ["door", "roast", "bar"] as const;

function Probe() {
  const active = useActiveScene(IDS);
  return <p data-testid="active">{active}</p>;
}

afterEach(() => vi.unstubAllGlobals());

describe("useActiveScene", () => {
  it("falls back to the first id when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Probe />);
    expect(screen.getByTestId("active")).toHaveTextContent("door");
  });

  it("reports the id of the scene that intersects", () => {
    let captured: IntersectionObserverCallback | undefined;
    class MockIO {
      constructor(cb: IntersectionObserverCallback) { captured = cb; }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
    }
    vi.stubGlobal("IntersectionObserver", MockIO as unknown as typeof IntersectionObserver);

    for (const id of IDS) {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
    }

    render(<Probe />);
    act(() => {
      captured?.(
        [{ isIntersecting: true, target: document.getElementById("bar")! } as unknown as IntersectionObserverEntry],
        {} as unknown as IntersectionObserver,
      );
    });

    expect(screen.getByTestId("active")).toHaveTextContent("bar");
    document.body.innerHTML = "";
  });
});
