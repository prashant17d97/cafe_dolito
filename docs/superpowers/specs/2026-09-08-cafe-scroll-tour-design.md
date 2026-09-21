# Café Dolitó — Scroll Tour (homepage as narrative)

Date: 2026-09-08
Status: Approved design, not yet implemented

## Problem

The homepage is a stack of nine independent marketing sections. It reads as a
brochure. Café Dolitó's proposition — one room where a roastery, an Italian
kitchen, and an Indian kitchen share a table — is stated in prose but never
*shown*. A visitor who scrolls learns facts in sequence; they never travel
through the place.

## Goal

Replace the hero with a five-scene scroll-driven tour that walks the visitor
from the street door to the communal table. The scroll position is the camera.
Every existing homepage section is retained below the tour, unchanged.

Success criteria:

1. A visitor scrolling from the top passes through five distinct, art-directed
   scenes before reaching the existing sections.
2. Each scene uses a visually different motion mechanic — none is a template
   with a swapped photograph.
3. With `prefers-reduced-motion: reduce`, the page degrades to five ordinary
   stacked sections with zero motion and no loss of content.
4. Lighthouse LCP on the homepage does not regress relative to the current
   `HeroParallax` hero.
5. All narrative copy is server-rendered text in the DOM, readable by search
   engines and screen readers without JavaScript.

## Non-goals

- ~~Video. Stills plus CSS motion only.~~ **SUPERSEDED 2026-09-08** at the user's
  request, after the delivered tour was judged to need more natural motion. Five
  ambient clips now play per scene. Two constraints hold the original intent:
  the clips are **play-on-view, never scroll-scrubbed** (seeking a video by
  scroll position cannot decode fast enough and judders — it would undo the
  linear-scroll fix), and each clip has a **locked-off camera with motion only
  inside the frame**, because CSS already supplies the camera move and doubling
  them reads as seasick. The existing stills become the video posters, so the
  server-rendered markup is unchanged.
- A motion library. `AGENTS.md` mandates CSS + rAF/IntersectionObserver.
- Touching any page other than `/`.
- Reworking or deduplicating the nine retained sections.

## Approach

### Considered

**A. Reuse the repo's rAF engine — chosen.** `src/features/use-parallax.ts`
already publishes `--p` (raw 0→1) and `--p-eased` (easeOutCubic) onto a sticky
stage, is unit-tested, and short-circuits to `0` under `prefers-reduced-motion`.
Extending it costs nothing and works in every browser the site supports.

**B. Native CSS scroll-driven animations.** `animation-timeline: scroll()/view()`
sits at roughly 84% global support in 2026, but remains behind
`layout.css.scroll-driven-animations.enabled` in Firefox stable. Shipping it
would mean maintaining two parallel motion systems for no user-visible gain.

**C. GSAP ScrollTrigger.** The industry default for scrubbing and pinning, but a
new runtime dependency and a direct violation of the project's no-motion-library
rule.

### Decision

Approach A. Approach B is the documented upgrade path: when Firefox unflags,
`use-parallax` can be reimplemented behind the same `--p` contract with no
changes to any scene, because scenes only ever read the custom properties.

## Architecture

```
src/components/home/tour/
  tour.tsx           composes the five scenes + rail; the only export page.tsx imports
  tour-stage.tsx     sticky shell — owns pinning and progress, nothing else
  scene-door.tsx     \
  scene-roast.tsx     |
  scene-bar.tsx       > one file per scene; each owns its own layer composition
  scene-kitchen.tsx   |
  scene-table.tsx    /
  tour-rail.tsx      fixed progress nav
  tour.test.tsx      the runnable check

src/features/use-active-scene.ts   IntersectionObserver → active scene index
src/mocks/tour.ts                  scene copy + ids, single source of truth
src/components/brand/motifs.tsx    BasilLeaf / Marigold, rescued from hero-parallax
                                   (AMENDED 2026-09-08: the other five motifs were
                                   deleted — only these two ever got placed, in scene 4)
public/tour/*.jpg                  twelve generated stills
```

### Boundaries

`tour-stage.tsx` knows how to pin an element and expose scroll progress. It knows
nothing about coffee. Its interface:

```tsx
<TourStage id="door" height="180vh">
  {/* children render inside the pinned viewport and read var(--p) */}
</TourStage>
```

Each `scene-*.tsx` knows its own photography and its own transform math and
nothing about its siblings. Adding or reordering a scene touches `tour.tsx` and
`src/mocks/tour.ts` only.

The deliberate rejection: a single generic `<Scene image={...} />` driven by a
config array. It would be less code and would make all five scenes the same
Ken Burns pan with different photographs — the exact templated quality the tour
exists to avoid. Variety is the product here, so it gets its own files.

## Scene script

Every stage is `180vh` tall with a `sticky top-0 h-svh` viewport inside.

| # | id | Scene | Mechanic driven by `--p` |
|---|----|----|----|
| 1 | `door` | The door — façade at blue hour | Camera pushes *through* the doorway: backplate `scale(1 → 1.35)`, vignette mask opens, `<h1>` lifts and fades |
| 2 | `roast` | The counter — roast in progress | Bean plane drifts down-left against a steam column rising; `filter: sepia/hue-rotate` warms across the scroll, so the roast itself darkens as you read |
| 3 | `bar` | The bar — the espresso pull | `clip-path: inset()` fills the cup with crema top-down; the portafilter plane parallaxes behind at half rate |
| 4 | `kitchen` | The kitchen — Italy meets India | Two half-width planes start apart and close to a seam at centre; basil and marigold motifs cross at the join. The fusion moment |
| 5 | `table` | The table — sit down | Camera dollies *out* from a close plate to the full communal table; copy resolves into the reserve CTA and a single testimonial |

### Copy

Scene 1 carries the page's only `<h1>`, inherited from the retired hero:
"Italy & India, over coffee." Eyebrow, subcopy, and both CTAs (`/menu`,
`/reserve`) move with it unchanged, so no conversion path is lost.

Scenes 2–5 each carry an eyebrow, an `<h2>`, and two to three sentences. Copy
lives in `src/mocks/tour.ts` beside the image paths, matching the existing
`src/mocks/content.ts` convention.

## Motion contract

Binding on every scene:

- Animate `transform`, `opacity`, `clip-path`, and `filter` only. No layout
  properties — nothing that triggers reflow on scroll.
- `h-svh`, never `h-screen`, so the mobile URL bar does not jolt the pin.
- `will-change: transform` on the two or three moving planes per scene, never on
  the stage itself.
- ~~Read `--p-eased` for travel and scale; read raw `--p` for rotation and
  colour, matching how `hero-parallax.tsx` already splits them.~~
  **REVERSED 2026-09-08.** Travel, scale and `clip-path` read raw `--p`.
  easeOutCubic's derivative is 3.0 at scene entry and 0 at exit, so an eased
  camera move covers most of its distance in the first fraction of the scroll:
  on a fast scroll or a trackpad flick the layers appeared to teleport, then sat
  still. Raw `--p` makes travel exactly proportional to the wheel, which is what
  "the scroll position is the camera" actually requires. `--p-eased` is now
  reserved for deliberate non-linear *opacity* reveals, where the curve is the
  effect rather than a lie about position. As of this amendment no scene claims
  it: scene 5's wide-table fade was moved to raw `--p` so the fade and the dolly
  it accompanies run on one curve. The property stays published because the
  reveal case is legitimate, not because anything currently needs it.
- Scenes read custom properties. They never call the hook or read scroll
  position themselves.

### Reduced motion

`use-parallax` already pins `--p` to `0`, which freezes every transform at its
rest state. On top of that, `tour-stage` drops out of the pinned layout entirely:

```
h-[180vh] motion-reduce:h-auto
sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto
```

The result is five ordinary stacked sections. No content is revealed by motion,
so nothing is unreachable when motion is off — text renders at full opacity from
first paint and animation only moves it.

## Assets

Twelve stills generated on one art-direction spine: same room, dusk key light,
35mm shallow depth of field, natural grain, brand palette locked to
`#6F4E37 #E7D2B6 #4A3020 #C68A4E #5B7B53 #E1A53A`, no text, no logos, no faces
in focus. Faces are excluded deliberately — generated faces read as uncanny and
would undercut a page whose whole job is to feel like a real room.

Stored in `public/tour/` as JPEG sources (1920w, 2400w for scene 1's backplate),
served through `next/image`, which transcodes to webp/avif per request — so the
source format does not affect delivered bytes. Sources total 6.4 MB; the
≤250 KB budget applies to served bytes and is enforced by `next/image` sizing,
not by the source files.

~~Scene 1's backplate is `priority`; all others lazy.~~ **AMENDED 2026-09-08.**
Lazy-loading every non-hero layer let a fast scroll outrun the loader, so scenes
2–5 popped in blank. The shipped policy has three tiers:

- `door-facade` is `priority` — the LCP image, and the only one that may hold a
  high-priority preload slot.
- The layer visible at each scene's **rest frame** (`counter-wide`,
  `bar-portafilter`, `kitchen-italy`, `kitchen-india`, `table-plate`) is
  `loading="eager"` **plus `fetchPriority="low"`**. Eager because that is the
  frame a fast scroll lands on; low because react-dom hoists a high-priority
  `<link rel="preload" as="image">` into `<head>` for every eager server `<img>`
  and those five filled React's 10-slot budget, racing the LCP image and
  demoting anything eager in the nine retained sections. `fetchPriority="low"`
  is react-dom's own escape hatch: the fetch still starts immediately, it just
  leaves the preload race.
- Layers that fade in **later within their scene** (`door-threshold`, `beans`,
  `roast-drum`, `cup-crema`, `kitchen-fusion`, `table-wide`) stay lazy. Nothing
  lands on them.

| file (`public/tour/`) | used by |
|----|----|
| `door-facade` | scene 1 backplate |
| `door-threshold` | scene 1 interior revealed through the opening |
| `counter-wide` | scene 2 backplate |
| `roast-drum` | scene 2 mid plane |
| `beans` | scene 2 drifting plane |
| `bar-portafilter` | scene 3 back plane |
| `cup-crema` | scene 3 clip-path fill subject |
| `kitchen-italy` | scene 4 left plane |
| `kitchen-india` | scene 4 right plane |
| `kitchen-fusion` | scene 4 seam reveal |
| `table-plate` | scene 5 open |
| `table-wide` | scene 5 close |

Five of these — `door-facade`, `roast-drum`, `cup-crema`, `kitchen-fusion`,
`table-wide` — now also serve as the **base layer beneath an ambient clip**. They
are not the video's `poster` attribute: a poster is a raw `/tour/*.jpg` that
bypasses `next/image` entirely, so hydration re-downloaded all five unoptimised
(~3.2 MB) on top of the optimised copies the server render had already fetched.
The still stays mounted as a `next/image` and the `<video>` is layered over it
with no `poster`; an undecoded video is transparent, so the still shows through
until playback starts — and forever if autoplay is blocked.

## Accessibility

- Exactly one `<h1>`, in scene 1.
- The rail is a real `<nav aria-label="Café tour">` of anchor links to scene ids,
  so it doubles as a keyboard bypass rather than being decorative chrome.
- A "Skip the tour" link, visible on focus, jumps past all five scenes to the
  retained sections below.
- `aria-current="true"` on the rail link for the active scene.
- Decorative planes are `aria-hidden`; every photograph that carries meaning has
  a real `alt`.

## Performance

Five stages means five scroll listeners, each doing one
`getBoundingClientRect()` per animation frame. Rect reads are cheap and already
frame-throttled by the existing hook, so this ships unguarded with a `ponytail:`
comment recording the ceiling and the fix — gate each hook on an
IntersectionObserver so off-screen scenes stop computing — should it ever
measure slow.

LCP is protected by making scene 1's backplate the priority image; it is the
first meaningful paint either way.

## Testing

One `tour.test.tsx`, in the existing vitest/jsdom setup:

- renders `<Tour />` and asserts exactly one `<h1>`
- asserts all five scene headings are present in the DOM with no
  `IntersectionObserver` defined, proving copy does not depend on motion
- asserts every rail link's `href` resolves to a rendered scene id

`use-parallax.test.ts` already covers the progress math and is not duplicated.

## Files changed

**New** — the tour directory, `use-active-scene.ts`, `src/mocks/tour.ts`,
`src/components/brand/motifs.tsx`, `public/tour/*.jpg`.

**Edited** — `src/app/page.tsx`: `<HeroParallax />` becomes `<Tour />`; the nine
existing sections below are untouched.

**Deleted** — `src/components/home/hero-parallax.tsx`, after its SVG motifs are
extracted to `motifs.tsx`.

## Known consequence

Scenes 4 and 5 restate what `StorySection` and `ReserveCta` say further down the
page, so the homepage says the fusion story twice. This was raised during design
and accepted: retaining every existing section was an explicit requirement.
Resolving it means cutting or merging those sections, which is a separate change.

## Upgrade path

When Firefox ships scroll-driven animations unflagged, reimplement
`use-parallax` on `animation-timeline: view()` behind the identical `--p` /
`--p-eased` contract. No scene file changes, and the main thread stops running
five rAF loops.
