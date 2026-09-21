# Café Dolitó Scroll Tour — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero with a five-scene, scroll-driven tour that walks a visitor from the street door to the communal table, retaining every existing homepage section below it.

**Architecture:** Each scene is an independently pinned `180vh` stage. The existing `useParallax` hook writes `--p` (raw 0→1) and `--p-eased` (easeOutCubic) onto each stage; scene components read those CSS custom properties from inline `calc()` and never touch scroll position themselves. `TourStage` owns pinning and nothing else; each scene owns its own layer composition, so no two scenes share a motion mechanic.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, Tailwind CSS v4, TypeScript, vitest + jsdom + Testing Library, `next/image`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-09-08-cafe-scroll-tour-design.md`

## Global Constraints

- **Package manager: pnpm only.** Never `npm` or `yarn`.
- **DO NOT COMMIT AND DO NOT PUSH.** The user reviews the working tree themselves. Every task ends with `git add` of the named files and nothing further. This overrides the usual commit-per-task rhythm.
- **No new dependencies.** Motion is CSS + rAF/IntersectionObserver only (`AGENTS.md`).
- **Light mode only.** Coffee-brown primary `#6F4E37`.
- Brand palette tokens already exist in `src/app/globals.css`: `--brand #4a3020`, `--caramel #c68a4e`, `--basil #5b7b53`, `--marigold #e1a53a`, `--accent #e7d2b6`. Use the Tailwind colour utilities (`text-brand`, `bg-caramel`, …) for all BRAND colour. Neutral scrim/vignette values over photography (`rgba(20,12,6,…)`) are exempt — they have no token equivalent and exist purely for text legibility.
- **Exactly one `<h1>` on the homepage**, and it lives in `SceneDoor`.
- **`prefers-reduced-motion: reduce` must fully disable the tour**, collapsing it to five ordinary stacked sections. Never gate content visibility on motion.
- Animate only `transform`, `opacity`, `clip-path`, `filter`. Never animate layout properties.
- Use `h-svh`, never `h-screen`, for pinned viewports.
- Fonts: `font-display` (Fraunces) for headings, `font-mono` for eyebrows, default sans (Manrope) for body — matching existing components.
- Verification commands: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/brand/motifs.tsx` | **Create.** The seven inline SVG motifs, extracted verbatim from `hero-parallax.tsx` so they survive its deletion. |
| `src/mocks/tour.ts` | **Create.** Scene ids, rail labels, and copy. Single source of truth for the tour's text. |
| `src/features/use-active-scene.ts` | **Create.** IntersectionObserver → id of the scene currently centred in the viewport. |
| `src/components/home/tour/tour-stage.tsx` | **Create.** Pinning shell. Owns `useParallax` and the reduced-motion collapse. Knows nothing about coffee. |
| `src/components/home/tour/scene-door.tsx` | **Create.** Scene 1. Carries the page's only `<h1>` and both hero CTAs. |
| `src/components/home/tour/scene-roast.tsx` | **Create.** Scene 2. Counter-drift + roast warming via `filter`. |
| `src/components/home/tour/scene-bar.tsx` | **Create.** Scene 3. Crema rises via `clip-path`. |
| `src/components/home/tour/scene-kitchen.tsx` | **Create.** Scene 4. Two planes close to a seam. |
| `src/components/home/tour/scene-table.tsx` | **Create.** Scene 5. Dolly out, resolves to the reserve CTA. |
| `src/components/home/tour/tour-rail.tsx` | **Create.** Sticky progress nav, scoped to the tour. |
| `src/components/home/tour/tour.tsx` | **Create.** Composes rail + five scenes + skip link. The only export `page.tsx` imports. |
| `src/components/home/tour/tour.test.tsx` | **Create.** The runnable check. |
| `src/app/page.tsx` | **Modify.** `<HeroParallax />` → `<Tour />`, plus the `#after-tour` anchor. |
| `src/components/home/hero-parallax.tsx` | **Delete**, after motifs are extracted. |

---

### Task 1: Extract the SVG motifs so they survive the hero's deletion

`hero-parallax.tsx` is going to be deleted in Task 7, and it holds seven hand-drawn SVG motifs that Scene 4 needs. Extract them first, as a pure refactor with no behaviour change.

**Files:**
- Create: `src/components/brand/motifs.tsx`
- Modify: `src/components/home/hero-parallax.tsx` (remove the motif definitions, import them instead)
- Test: `src/components/brand/motifs.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `BasilLeaf`, `PastaCurl`, `Tomato`, `CardamomPod`, `StarAnise`, `Marigold`, `SteamPlume` — each `({ className }: { className?: string }) => JSX.Element`.

- [ ] **Step 1: Copy the motif block out verbatim**

Do NOT retype the SVG path data — copy it mechanically so the artwork is byte-identical:

```bash
cd /Users/prashant/Documents/PP/cafe_dolito
{
  echo 'import { cn } from "@/lib/utils";'
  echo ''
  sed -n '14,180p' src/components/home/hero-parallax.tsx
} > src/components/brand/motifs.tsx
```

Then verify all seven arrived:

```bash
grep -c '^function ' src/components/brand/motifs.tsx   # expect 7
```

- [ ] **Step 2: Export each motif**

In `src/components/brand/motifs.tsx`, change each of the seven `function X(` declarations to `export function X(`:

```bash
sed -i '' 's/^function \(BasilLeaf\|PastaCurl\|Tomato\|CardamomPod\|StarAnise\|Marigold\|SteamPlume\)(/export function \1(/' src/components/brand/motifs.tsx
grep -c '^export function ' src/components/brand/motifs.tsx   # expect 7
```

- [ ] **Step 3: Write the failing test**

Create `src/components/brand/motifs.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  BasilLeaf, PastaCurl, Tomato, CardamomPod, StarAnise, Marigold, SteamPlume,
} from "./motifs";

describe("brand motifs", () => {
  it("renders every motif and forwards className", () => {
    const motifs = [BasilLeaf, PastaCurl, Tomato, CardamomPod, StarAnise, Marigold, SteamPlume];
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
```

- [ ] **Step 4: Run the test to prove the extraction is self-contained**

Run: `pnpm vitest run src/components/brand/motifs.test.tsx`
Expected at this point: PASS (the new file already stands alone). If it FAILS on a missing `cn` import or a stray reference, fix `motifs.tsx` until it passes — that failure means the extracted range was wrong.

- [ ] **Step 5: Make the hero consume the extracted motifs**

In `src/components/home/hero-parallax.tsx`, delete the same lines 14–180 that were copied out, and add this import beside the existing ones:

```tsx
import {
  BasilLeaf, PastaCurl, Tomato, CardamomPod, StarAnise, Marigold, SteamPlume,
} from "@/components/brand/motifs";
```

- [ ] **Step 6: Verify nothing regressed**

Run: `pnpm typecheck && pnpm lint && pnpm vitest run`
Expected: all pass. The homepage renders exactly as before — this task changed no pixels.

- [ ] **Step 7: Stage, do not commit**

```bash
git add src/components/brand/motifs.tsx src/components/brand/motifs.test.tsx src/components/home/hero-parallax.tsx
```

---

### Task 2: Scene data and the active-scene hook

**Files:**
- Create: `src/mocks/tour.ts`
- Create: `src/features/use-active-scene.ts`
- Test: `src/features/use-active-scene.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface TourScene { id: string; label: string; eyebrow: string; title: string; body: string }`
  - `TOUR_SCENES: readonly TourScene[]` — exactly five entries, ids in order: `door`, `roast`, `bar`, `kitchen`, `table`.
  - `TOUR_SCENE_IDS: readonly string[]` — module-level constant, stable identity.
  - `useActiveScene(ids: readonly string[]): string` — returns the id of the scene nearest viewport centre; returns `ids[0]` before any observation and in environments with no `IntersectionObserver`.

- [ ] **Step 1: Write the scene data**

Create `src/mocks/tour.ts`:

```ts
export interface TourScene {
  /** DOM id — also the rail anchor target. */
  id: string;
  /** Short name, used by the rail's screen-reader label. */
  label: string;
  /** Small mono line above the heading. */
  eyebrow: string;
  title: string;
  body: string;
}

/**
 * The five scenes of the café tour, in scroll order.
 * Scene 1 carries the page's only <h1>; its eyebrow keeps the brand/SEO
 * line inherited from the retired hero.
 */
export const TOUR_SCENES: readonly TourScene[] = [
  {
    id: "door",
    label: "The door",
    eyebrow: "Specialty coffee · Italian · Indian · Fusion",
    title: "Italy & India, over coffee.",
    body: "Slow-roasted single-origin blends. Handmade pasta. Cardamom chai. All in one warm corner of the city.",
  },
  {
    id: "roast",
    label: "The counter",
    eyebrow: "02 — The counter",
    title: "We roast it ten steps from your cup.",
    body: "Green beans go into the drum most mornings before service. You can smell which day it was the moment the door swings shut behind you.",
  },
  {
    id: "bar",
    label: "The bar",
    eyebrow: "03 — The bar",
    title: "Then somebody pulls it, properly.",
    body: "Twenty-five seconds, a hair over ninety-two degrees, and a crema the colour of hazelnut skin. No syrups hiding anything.",
  },
  {
    id: "kitchen",
    label: "The kitchen",
    eyebrow: "04 — The kitchen",
    title: "Two stoves. One pass.",
    body: "A Neapolitan baker on one side, a tandoor on the other. They started swapping ingredients across the pass, and the fusion table was born.",
  },
  {
    id: "table",
    label: "The table",
    eyebrow: "05 — The table",
    title: "It all arrives at one table.",
    body: "One long oak table, plates in the middle, nobody standing on ceremony. Pull out a chair.",
  },
];

/** Stable module-level id list — pass this to useActiveScene. */
export const TOUR_SCENE_IDS: readonly string[] = TOUR_SCENES.map((s) => s.id);
```

- [ ] **Step 2: Write the failing test for the hook**

Create `src/features/use-active-scene.test.tsx`:

```tsx
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
        [{ isIntersecting: true, target: document.getElementById("bar")! } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getByTestId("active")).toHaveTextContent("bar");
    document.body.innerHTML = "";
  });
});
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `pnpm vitest run src/features/use-active-scene.test.tsx`
Expected: FAIL — `Failed to resolve import "./use-active-scene"`.

- [ ] **Step 4: Implement the hook**

Create `src/features/use-active-scene.ts`:

```ts
"use client";
import { useEffect, useState } from "react";

/**
 * Reports which of the given element ids is currently centred in the viewport.
 * `ids` should be a module-level constant; identity is not depended on — the
 * effect keys off the joined string so an inline array will not thrash.
 */
export function useActiveScene(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const key = ids.join(",");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // A narrow band across the viewport's middle: whichever scene crosses the
    // centre line is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm vitest run src/features/use-active-scene.test.tsx`
Expected: PASS, both cases.

- [ ] **Step 6: Stage, do not commit**

```bash
git add src/mocks/tour.ts src/features/use-active-scene.ts src/features/use-active-scene.test.tsx
```

---

### Task 3: The pinning shell

**Files:**
- Create: `src/components/home/tour/tour-stage.tsx`
- Test: `src/components/home/tour/tour-stage.test.tsx`

**Interfaces:**
- Consumes: `useParallax` from `@/features/use-parallax` (existing; writes `--p` and `--p-eased`, and forces both to `0` under `prefers-reduced-motion`).
- Produces: `TourStage({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string })`.

- [ ] **Step 1: Write the failing test**

Create `src/components/home/tour/tour-stage.test.tsx`:

```tsx
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
    expect(viewport.className).toContain("motion-reduce:static");
    expect(viewport.className).toContain("h-svh");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/components/home/tour/tour-stage.test.tsx`
Expected: FAIL — `Failed to resolve import "./tour-stage"`.

- [ ] **Step 3: Implement the stage**

Create `src/components/home/tour/tour-stage.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useParallax } from "@/features/use-parallax";
import { cn } from "@/lib/utils";

interface TourStageProps {
  /** DOM id — the rail anchors to this. */
  id: string;
  /** Accessible name for the section landmark. */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A pinned scroll stage. Owns pinning and scroll progress, nothing else.
 *
 * useParallax writes --p (raw 0→1) and --p-eased (easeOutCubic) onto the
 * outer element; children read them from inline calc(). Under
 * prefers-reduced-motion the hook pins both to 0 AND the layout drops out
 * of the pin entirely, so the stage becomes an ordinary stacked section.
 *
 * ponytail: one rAF scroll listener per stage, ungated. Rect reads are cheap
 * and already frame-throttled; if five stages ever measure slow, gate each
 * hook on an IntersectionObserver so off-screen stages stop computing.
 */
export function TourStage({ id, label, children, className }: TourStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref as React.RefObject<HTMLElement | null>);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cn("relative h-[180vh] motion-reduce:h-auto", className)}
    >
      <div
        className={cn(
          "sticky top-0 h-svh overflow-hidden bg-background",
          "motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible",
        )}
      >
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pnpm vitest run src/components/home/tour/tour-stage.test.tsx`
Expected: PASS, both cases.

- [ ] **Step 5: Stage, do not commit**

```bash
git add src/components/home/tour/tour-stage.tsx src/components/home/tour/tour-stage.test.tsx
```

---

### Task 4: Scenes 1 and 2 — the door and the counter

Two scenes, two different mechanics. Scene 1 pushes the camera through a doorway; scene 2 drifts planes against each other and warms the roast with a `filter`.

**Files:**
- Create: `src/components/home/tour/scene-door.tsx`
- Create: `src/components/home/tour/scene-roast.tsx`

**Interfaces:**
- Consumes: `TourStage` (Task 3), `TOUR_SCENES` (Task 2), `Container` from `@/components/common/container`, `Button` from `@/components/ui/button`.
- Produces: `SceneDoor()`, `SceneRoast()` — both zero-argument components.

- [ ] **Step 1: Implement scene 1**

Create `src/components/home/tour/scene-door.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { TOUR_SCENES } from "@/mocks/tour";
import { TourStage } from "./tour-stage";

const scene = TOUR_SCENES[0];

/**
 * Scene 1 — the door.
 * Mechanic: the camera pushes THROUGH the doorway. The façade scales up while
 * a radial vignette opens outward, so the dark frame peels away and the warm
 * interior swallows the viewport. Copy lifts and fades as you cross over.
 */
export function SceneDoor() {
  return (
    <TourStage id={scene.id} label={scene.label}>
      {/* Façade — pushes in */}
      <div
        className="absolute inset-0"
        style={{
          transform: "scale(calc(1 + var(--p-eased, 0) * 0.35))",
          willChange: "transform",
        }}
      >
        <Image
          src="/tour/door-facade.jpg"
          alt="The Café Dolitó doorway at dusk, warm light spilling across the cobbles"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Interior — waits beyond the threshold, resolves as you cross it */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: "calc((var(--p, 0) - 0.45) * 2.4)",
          transform: "scale(calc(1.12 - var(--p-eased, 0) * 0.12))",
          willChange: "transform, opacity",
        }}
      >
        <Image src="/tour/door-threshold.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      {/* Vignette — the aperture opens as you step through */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 38% 52%, rgba(0,0,0,0) calc(12% + var(--p-eased, 0) * 55%), rgba(20,12,6,0.94) 100%)",
        }}
      />

      {/* Copy — lifts away as the room takes over */}
      <div
        className="relative flex h-full items-center"
        style={{
          transform: "translateY(calc(var(--p, 0) * -60px))",
          opacity: "calc(1 - var(--p, 0) * 1.5)",
          willChange: "transform, opacity",
        }}
      >
        <Container className="text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-white/80">
            {scene.eyebrow}
          </p>
          <h1 className="mb-4 text-balance font-display text-4xl font-semibold leading-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
            {scene.title}
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-sm text-white/85 sm:text-base">
            {scene.body}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="px-7 py-2.5 text-sm font-semibold tracking-wide">
              <Link href="/menu">View the menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 px-7 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-white hover:text-brand"
            >
              <Link href="/reserve">Reserve a table</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Scroll cue — fades out the moment you start */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-8 flex justify-center motion-reduce:hidden"
        style={{ opacity: "calc(1 - var(--p, 0) * 3)" }}
      >
        <ChevronDown className="size-6 animate-bounce text-white/70" />
      </div>
    </TourStage>
  );
}
```

- [ ] **Step 2: Implement scene 2**

Create `src/components/home/tour/scene-roast.tsx`:

```tsx
"use client";

import Image from "next/image";

import { Container } from "@/components/common/container";
import { TOUR_SCENES } from "@/mocks/tour";
import { TourStage } from "./tour-stage";

const scene = TOUR_SCENES[1];

/**
 * Scene 2 — the counter.
 * Mechanic: three planes at different rates, plus the roast itself darkening.
 * The drum warms through saturate()/sepia() as you scroll, so scrolling IS
 * the roast progressing.
 */
export function SceneRoast() {
  return (
    <TourStage id={scene.id} label={scene.label}>
      {/* Counter backplate — slowest */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: "translate3d(0, calc(var(--p-eased, 0) * -6%), 0) scale(1.08)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/counter-wide.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.55)]" />

      {/* The roaster — warms and darkens across the scroll */}
      <div
        className="absolute inset-y-0 right-0 w-[58%] opacity-90"
        style={{
          transform: "translate3d(calc(var(--p, 0) * -5%), 0, 0)",
          filter: "saturate(calc(0.65 + var(--p, 0) * 0.75)) sepia(calc(var(--p, 0) * 0.3))",
          willChange: "transform, filter",
        }}
      >
        <Image
          src="/tour/roast-drum.jpg"
          alt="A copper drum roaster with beans tumbling into the cooling tray"
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          className="object-cover"
        />
      </div>

      {/* Bean plane — drifts counter to everything else */}
      <div
        aria-hidden
        className="absolute -inset-x-12 bottom-0 h-[34%] opacity-60"
        style={{
          transform:
            "translate3d(calc(var(--p, 0) * -7%), calc(var(--p-eased, 0) * 16%), 0)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/beans.jpg" alt="" fill sizes="120vw" className="object-cover" />
      </div>

      <div className="relative flex h-full items-center">
        <Container>
          <div
            className="max-w-md"
            style={{
              transform: "translateY(calc((0.5 - var(--p-eased, 0)) * 40px))",
              willChange: "transform",
            }}
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-caramel">
              {scene.eyebrow}
            </p>
            <h2 className="mb-4 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {scene.title}
            </h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{scene.body}</p>
          </div>
        </Container>
      </div>
    </TourStage>
  );
}
```

- [ ] **Step 3: Verify both compile and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass, no errors in the two new files.

- [ ] **Step 4: Stage, do not commit**

```bash
git add src/components/home/tour/scene-door.tsx src/components/home/tour/scene-roast.tsx
```

---

### Task 5: Scenes 3 and 4 — the bar and the kitchen

**Files:**
- Create: `src/components/home/tour/scene-bar.tsx`
- Create: `src/components/home/tour/scene-kitchen.tsx`

**Interfaces:**
- Consumes: `TourStage` (Task 3), `TOUR_SCENES` (Task 2), `BasilLeaf` and `Marigold` from `@/components/brand/motifs` (Task 1).
- Produces: `SceneBar()`, `SceneKitchen()`.

- [ ] **Step 1: Implement scene 3**

Create `src/components/home/tour/scene-bar.tsx`:

```tsx
"use client";

import Image from "next/image";

import { Container } from "@/components/common/container";
import { TOUR_SCENES } from "@/mocks/tour";
import { TourStage } from "./tour-stage";

const scene = TOUR_SCENES[2];

/**
 * Scene 3 — the bar.
 * Mechanic: clip-path. The cup fills with crema from the bottom up as you
 * scroll, so the scroll bar and the espresso shot are the same gesture.
 */
export function SceneBar() {
  return (
    <TourStage id={scene.id} label={scene.label}>
      {/* Machine — parallaxes behind at half rate */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: "translate3d(0, calc(var(--p-eased, 0) * -5%), 0) scale(1.06)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/bar-portafilter.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.6)]" />

      {/* The pour — crema rises with scroll progress */}
      <div className="absolute inset-y-0 right-[6%] hidden w-[38%] items-center md:flex">
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/15 shadow-2xl">
          <div
            className="absolute inset-0"
            style={{
              clipPath: "inset(calc(100% - var(--p-eased, 0) * 100%) 0 0 0)",
              willChange: "clip-path",
            }}
          >
            <Image
              src="/tour/cup-crema.jpg"
              alt="An espresso pulled to a thick hazelnut crema"
              fill
              sizes="38vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative flex h-full items-center">
        <Container>
          <div
            className="max-w-md"
            style={{
              transform: "translateY(calc((0.5 - var(--p-eased, 0)) * 40px))",
              willChange: "transform",
            }}
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-caramel">
              {scene.eyebrow}
            </p>
            <h2 className="mb-4 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {scene.title}
            </h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{scene.body}</p>
          </div>
        </Container>
      </div>
    </TourStage>
  );
}
```

- [ ] **Step 2: Implement scene 4**

Create `src/components/home/tour/scene-kitchen.tsx`:

```tsx
"use client";

import Image from "next/image";

import { Container } from "@/components/common/container";
import { BasilLeaf, Marigold } from "@/components/brand/motifs";
import { TOUR_SCENES } from "@/mocks/tour";
import { TourStage } from "./tour-stage";

const scene = TOUR_SCENES[3];

/**
 * Scene 4 — the kitchen.
 * Mechanic: two half-width planes start apart and close to a seam at centre,
 * with the fusion plate revealed at the join. The motifs cross as they meet.
 * This is the page's thesis rendered as motion.
 */
export function SceneKitchen() {
  return (
    <TourStage id={scene.id} label={scene.label}>
      {/* Fusion plate — waits underneath, revealed once the halves close */}
      <div
        className="absolute inset-0"
        style={{ opacity: "calc((var(--p, 0) - 0.5) * 2.6)", willChange: "opacity" }}
      >
        <Image
          src="/tour/kitchen-fusion.jpg"
          alt="Paccheri in a spiced masala sauce, finished with basil and coriander"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Italy — slides in from the left */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          transform: "translate3d(calc((1 - var(--p-eased, 0)) * -55%), 0, 0)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/kitchen-italy.jpg" alt="" fill sizes="50vw" className="object-cover" />
      </div>

      {/* India — slides in from the right */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          transform: "translate3d(calc((1 - var(--p-eased, 0)) * 55%), 0, 0)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/kitchen-india.jpg" alt="" fill sizes="50vw" className="object-cover" />
      </div>

      {/* Motifs cross at the seam as the halves close. The SVG components take
          only className, so the transform lives on a positioned wrapper. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[28%] motion-reduce:hidden"
        style={{
          transform: "translate3d(calc(var(--p-eased, 0) * 120px - 60px), 0, 0)",
          opacity: "calc(var(--p, 0) * 1.2)",
          willChange: "transform, opacity",
        }}
      >
        <BasilLeaf className="w-8 text-basil drop-shadow" />
      </div>
      <div
        aria-hidden
        className="absolute bottom-[26%] left-1/2 motion-reduce:hidden"
        style={{
          transform: "translate3d(calc(60px - var(--p-eased, 0) * 120px), 0, 0)",
          opacity: "calc(var(--p, 0) * 1.2)",
          willChange: "transform, opacity",
        }}
      >
        <Marigold className="w-10 text-marigold drop-shadow" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.5)]" />

      <div className="relative flex h-full items-end pb-16 sm:items-center sm:pb-0">
        <Container>
          <div
            className="max-w-md"
            style={{
              transform: "translateY(calc((0.5 - var(--p-eased, 0)) * 40px))",
              willChange: "transform",
            }}
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-marigold">
              {scene.eyebrow}
            </p>
            <h2 className="mb-4 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {scene.title}
            </h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{scene.body}</p>
          </div>
        </Container>
      </div>
    </TourStage>
  );
}
```

- [ ] **Step 3: Verify both compile and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Stage, do not commit**

```bash
git add src/components/home/tour/scene-bar.tsx src/components/home/tour/scene-kitchen.tsx
```

---

### Task 6: Scene 5 and the progress rail

**Files:**
- Create: `src/components/home/tour/scene-table.tsx`
- Create: `src/components/home/tour/tour-rail.tsx`

**Interfaces:**
- Consumes: `TourStage` (Task 3), `TOUR_SCENES` / `TOUR_SCENE_IDS` (Task 2), `useActiveScene` (Task 2), `Button`.
- Produces: `SceneTable()`, `TourRail()`.

- [ ] **Step 1: Implement scene 5**

Create `src/components/home/tour/scene-table.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { TOUR_SCENES } from "@/mocks/tour";
import { TourStage } from "./tour-stage";

const scene = TOUR_SCENES[4];

/**
 * Scene 5 — the table.
 * Mechanic: the camera dollies OUT. A close plate recedes and the full
 * communal table resolves behind it — the reverse of scene 1's push-in, so
 * the tour closes the gesture it opened with.
 */
export function SceneTable() {
  return (
    <TourStage id={scene.id} label={scene.label}>
      {/* Wide table — resolves as the plate recedes */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: "scale(calc(1.15 - var(--p-eased, 0) * 0.15))",
          opacity: "var(--p-eased, 0)",
          willChange: "transform, opacity",
        }}
      >
        <Image src="/tour/table-wide.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      {/* Plate — starts close, pulls back */}
      <div
        className="absolute inset-0"
        style={{
          transform: "scale(calc(1.45 - var(--p-eased, 0) * 0.45))",
          opacity: "calc(1 - var(--p, 0) * 1.3)",
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/tour/table-plate.jpg"
          alt="A shared plate and an espresso on the marble, hands reaching in"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.55)]" />

      <div className="relative flex h-full items-center">
        <Container className="text-center">
          <div
            style={{
              transform: "translateY(calc((1 - var(--p-eased, 0)) * 40px))",
              opacity: "calc(var(--p, 0) * 1.6)",
              willChange: "transform, opacity",
            }}
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-marigold">
              {scene.eyebrow}
            </p>
            <h2 className="mx-auto mb-4 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {scene.title}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              {scene.body}
            </p>
            <Button asChild size="lg" className="px-7 py-2.5 text-sm font-semibold tracking-wide">
              <Link href="/reserve">Reserve a table</Link>
            </Button>
          </div>
        </Container>
      </div>
    </TourStage>
  );
}
```

- [ ] **Step 2: Write the failing test for the rail**

Create `src/components/home/tour/tour-rail.test.tsx`:

```tsx
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
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `pnpm vitest run src/components/home/tour/tour-rail.test.tsx`
Expected: FAIL — `Failed to resolve import "./tour-rail"`.

- [ ] **Step 4: Implement the rail**

Create `src/components/home/tour/tour-rail.tsx`:

```tsx
"use client";

import { useActiveScene } from "@/features/use-active-scene";
import { TOUR_SCENES, TOUR_SCENE_IDS } from "@/mocks/tour";
import { cn } from "@/lib/utils";

/**
 * Progress rail. Sticky rather than fixed, so it lives and dies with the tour
 * instead of following the reader down the rest of the page.
 *
 * These are real anchor links, not decorative dots — they double as the
 * keyboard route through the tour.
 */
export function TourRail() {
  const active = useActiveScene(TOUR_SCENE_IDS);

  return (
    <nav
      aria-label="Café tour"
      className="pointer-events-none sticky top-1/2 z-30 hidden h-0 lg:block"
    >
      <ol className="pointer-events-auto absolute right-6 flex -translate-y-1/2 flex-col gap-4">
        {TOUR_SCENES.map((scene) => {
          const isActive = active === scene.id;
          return (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                aria-current={isActive ? "true" : undefined}
                className="flex items-center justify-end gap-2 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span className="sr-only">{scene.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive ? "h-2.5 w-2.5 bg-white" : "h-1.5 w-1.5 bg-white/45",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm vitest run src/components/home/tour/tour-rail.test.tsx`
Expected: PASS.

- [ ] **Step 6: Stage, do not commit**

```bash
git add src/components/home/tour/scene-table.tsx src/components/home/tour/tour-rail.tsx src/components/home/tour/tour-rail.test.tsx
```

---

### Task 7: Compose the tour, wire the homepage, retire the hero

**Files:**
- Create: `src/components/home/tour/tour.tsx`
- Create: `src/components/home/tour/tour.test.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/components/home/hero-parallax.tsx`

**Interfaces:**
- Consumes: `SceneDoor`, `SceneRoast`, `SceneBar`, `SceneKitchen`, `SceneTable`, `TourRail`.
- Produces: `Tour()` — the single component `page.tsx` imports.

- [ ] **Step 1: Write the failing test**

Create `src/components/home/tour/tour.test.tsx`. `next/image` is mocked to a plain `<img>` so jsdom does not have to run the optimiser:

```tsx
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/components/home/tour/tour.test.tsx`
Expected: FAIL — `Failed to resolve import "./tour"`.

- [ ] **Step 3: Implement the composition**

Create `src/components/home/tour/tour.tsx`:

```tsx
import { SceneDoor } from "./scene-door";
import { SceneRoast } from "./scene-roast";
import { SceneBar } from "./scene-bar";
import { SceneKitchen } from "./scene-kitchen";
import { SceneTable } from "./scene-table";
import { TourRail } from "./tour-rail";

/**
 * The café tour: five pinned scenes read as one continuous walk from the
 * street door to the communal table.
 */
export function Tour() {
  return (
    <div className="relative">
      <a
        href="#after-tour"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip the tour
      </a>

      <TourRail />

      <SceneDoor />
      <SceneRoast />
      <SceneBar />
      <SceneKitchen />
      <SceneTable />
    </div>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pnpm vitest run src/components/home/tour/tour.test.tsx`
Expected: PASS, all four cases.

- [ ] **Step 5: Wire the homepage**

In `src/app/page.tsx`, replace the `HeroParallax` import with the tour:

```tsx
import { Tour } from "@/components/home/tour/tour";
```

and replace the hero element and the section that follows it, so the tour is first and the retained sections get the skip-link's landing anchor:

```tsx
      {/* The café tour — five pinned scenes. Carries the single <h1>. */}
      <Tour />

      <div id="after-tour" />

      <TrustMarquee />
```

Everything from `<TrustMarquee />` onward stays exactly as it is.

- [ ] **Step 6: Delete the retired hero**

```bash
git rm src/components/home/hero-parallax.tsx
grep -rn "hero-parallax" src || echo "no references remain"
```

Expected: `no references remain`.

- [ ] **Step 7: Full verification**

Run each and confirm:

```bash
pnpm typecheck   # expect: no errors
pnpm lint        # expect: no errors
pnpm test        # expect: all suites pass, including the pre-existing ones
pnpm build       # expect: compiles, / renders as a static or server page
```

If `pnpm build` reports the homepage image budget, confirm `/tour/door-facade.jpg` is the only `priority` image in the tour.

- [ ] **Step 8: Verify the reduced-motion path by hand**

Run `pnpm dev`, open `/`, then in DevTools use **Rendering → Emulate CSS prefers-reduced-motion: reduce** and reload.
Expected: no pinning, no parallax, five ordinary stacked sections, all five headings and both CTAs readable, page height roughly a fifth of the animated version.

- [ ] **Step 9: Stage, do not commit**

```bash
git add src/components/home/tour/tour.tsx src/components/home/tour/tour.test.tsx src/app/page.tsx
git status --short
```

Then STOP and hand the working tree to the user for review. Do not commit. Do not push.

---

## Notes for the reviewer

- **Known duplication, accepted during design:** scenes 4 and 5 restate what `StorySection` and `ReserveCta` say further down the page. Retaining every existing section was an explicit requirement; resolving the overlap is a separate change.
- **Upgrade path:** when Firefox unflags scroll-driven animations, `use-parallax` can be reimplemented on `animation-timeline: view()` behind the identical `--p` / `--p-eased` contract, with no scene file changes.
