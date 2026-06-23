# Café Dolitó — Phase 2: Landing + Site Shell + Parallax Hero (Plan 2 of 6)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the visible brand-promotion landing page — a scroll-told story anchored by an "alive" layered-parallax coffee-jar hero — plus the persistent site shell (navbar/footer) and the reusable design-system components the rest of the site will use.

**Architecture:** Thin `app/page.tsx` (RSC) fetches data via the Phase-1 services and composes client section components, each wrapped in `<Reveal>`. The shell (`SiteShell`) wraps every route via the root layout. Motion is CSS keyframes + a single rAF scroll loop (`use-parallax`) + IntersectionObserver (`Reveal`/`CountUp`) — **no framer-motion**. All consumes the Phase-1 foundation (tokens, types, services, stores, shadcn primitives) already on `main`.

**Tech Stack:** Next.js 16 App Router (RSC + `"use client"` islands) · React 19 · Tailwind v4 · shadcn/ui (radix-nova) · embla-carousel · lucide-react · sonner · zustand · **pnpm**.

## Global Constraints
- **pnpm only.** `pnpm dev|build|typecheck|lint|test`.
- **Commits carry NO AI/Claude signature** (no `Co-Authored-By`, no `Generated with`). Plain messages only.
- **No framer-motion / GSAP.** Motion = `cd-*` CSS keyframes + `use-parallax` (rAF) + IntersectionObserver. **Every** animation gated by `prefers-reduced-motion` (static fallback).
- **Use existing design tokens only** — coffee-brown `--primary #6f4e37`, `--brand #4a3020` (AA text), cream `--background`, `--accent`/`--caramel`/`--basil`(Italy)/`--marigold`(India). NEVER hardcode hex in components; use token classes (`bg-primary`, `text-brand`, `text-muted-foreground`, `border-border`, etc.). Display type = `font-display` (Fraunces); body = default (Manrope); eyebrows/labels = `font-mono`.
- **Images via `next/image`** from the Unsplash manifest (`@/mocks/images` → `unsplash(IMG.*)`); `fill`+`sizes`, `priority` only on the hero backplate/jar; `object-cover`; meaningful `alt`. Add new `IMG` keys as needed (don't inline raw URLs in components).
- **Accessibility:** semantic landmarks (`header`/`nav`/`main`/`footer`), visible focus, `aria-label` on icon-only buttons, contrast ≥4.5:1, touch targets ≥44px, headings sequential.
- **SSR hydration:** values that come from persisted zustand stores (cart count, auth) must be **mounted-guarded** (render after a `useEffect` mount flag) to avoid hydration mismatch.
- **Files ≤ ~400 lines**, one responsibility. Reuse `cn`, `Container`, `SectionHeading`, `Reveal`.
- **Design pattern = Scroll-Triggered Storytelling / Motion-Driven:** intro hook → cuisine chapters → climax reservation CTA. Make it feel crafted and alive, NOT a generic stacked template.

## Design Direction (from ui-ux-pro-max)
- **Narrative arc:** Hero (hook: "Italy & India, over coffee") → trust marquee → "three kitchens, one counter" cuisines → signature **Fusion Table** carousel → bean-to-cup + Italy-meets-India **story** with animated stats → seasonal banner → testimonials → **"Pull up a chair" reservation climax CTA** → newsletter → gallery strip → footer.
- **Hero motion:** sticky ~180vh stage; scroll progress drives 5 layers at different rates (backplate slow → ambience medium → jar scales/rotates/lifts with rising steam + caramel glow → headline fastest, slight counter-move). Italy motifs (basil, tomato) drift up-left; India motifs (cardamom, star-anise, marigold) drift up-right.
- **Microinteractions:** hover 300ms ease-out; card press subtle scale 0.98; entrance via `Reveal` with 40–60ms stagger; counters via `CountUp`.

## File Structure (this phase)
```
src/components/common/   container.tsx · section-heading.tsx · reveal.tsx · count-up.tsx
src/components/brand/     logo.tsx
src/components/providers/ providers.tsx
src/components/layout/    announcement-bar.tsx · navbar.tsx · mobile-nav.tsx · footer.tsx · site-shell.tsx
src/features/             use-parallax.ts (+ use-parallax.test.ts)
src/components/home/      hero-parallax.tsx · parallax-layer.tsx · trust-marquee.tsx · cuisine-grid.tsx ·
                          fusion-carousel.tsx · home-item-card.tsx · story-section.tsx · stat-counters.tsx ·
                          seasonal-banner.tsx · testimonials.tsx · reserve-cta.tsx · newsletter-section.tsx ·
                          gallery-strip.tsx
src/app/layout.tsx (modify) · src/app/page.tsx (rewrite) · src/mocks/images.ts (add hero/gallery keys)
```

---

## Task 1: Common components — Container, SectionHeading, Reveal, CountUp

**Files:** Create `src/components/common/{container,section-heading,reveal,count-up}.tsx`. Test: `src/components/common/reveal.test.tsx`.

**Interfaces — Produces:**
- `Container({className?, children})` — centered `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`.
- `SectionHeading({eyebrow?, title, description?, align?, action?})` — `font-mono` uppercase tracked eyebrow in `text-brand`, `font-display` title, optional `text-muted-foreground` description, optional `action` link.
- `Reveal({children, className?, delay?, as?})` — `"use client"`; IntersectionObserver (threshold 0.12, rootMargin "0px 0px -8% 0px") toggles a `visible` state; hidden = `opacity-0 translate-y-4`, visible = `opacity-100 translate-y-0`, with `transition` ~600ms ease-out and `motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`; `delay` adds inline `transitionDelay`.
- `CountUp({end, duration?, suffix?, prefix?})` — `"use client"`; starts on first in-view (IntersectionObserver, once), animates 0→end via `requestAnimationFrame` with easeOutCubic; reduced-motion (or jsdom no-rAF) renders `end` immediately; renders `prefix + value + suffix` with `tabular-nums`.

- [ ] **Step 1:** Implement `Container` and `SectionHeading` (presentational; use tokens; `SectionHeading` `align` default "left", supports "center").
- [ ] **Step 2:** Implement `Reveal` with IntersectionObserver + reduced-motion classes (set `visible` once on intersect; disconnect after).
- [ ] **Step 3:** Implement `CountUp` (rAF easeOutCubic; guard `window.matchMedia?.("(prefers-reduced-motion: reduce)").matches` and absence of rAF → set value=end immediately).
- [ ] **Step 4:** Write `reveal.test.tsx` — render `<Reveal><p>hi</p></Reveal>`, assert the child text is present (smoke test; stub `IntersectionObserver` on `window` in the test). Run `pnpm test src/components/common/reveal.test.tsx` → pass.
- [ ] **Step 5:** `pnpm typecheck` + `pnpm lint` clean.
- [ ] **Step 6:** Commit — `feat(home): add common components (container, section-heading, reveal, count-up)`.

**Note for test:** jsdom lacks `IntersectionObserver`; in the test file stub it: `class IO { constructor(cb){} observe(){} disconnect(){} unobserve(){} }; vi.stubGlobal("IntersectionObserver", IO)`. Components must not crash if `IntersectionObserver` is undefined (guard with `if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }`).

---

## Task 2: Brand logo + Providers

**Files:** Create `src/components/brand/logo.tsx`, `src/components/providers/providers.tsx`.

**Interfaces — Produces:** `Logo({className?, withWordmark?})`; `Providers({children})`.
- Consumes: `Tooltip` provider + `Toaster` from `@/components/ui` (Phase 1).

- [ ] **Step 1:** `Logo` — inline SVG mark (a simple coffee cup / bean roundel using `currentColor`) + `font-display` wordmark "Café Dolitó"; sizes via props; `aria-label="Café Dolitó home"` when used as a link elsewhere.
- [ ] **Step 2:** `Providers` — `"use client"`; wrap `children` in shadcn `TooltipProvider`; render `<Toaster position="top-center" richColors closeButton />` after children. (Auth/cart come from persisted zustand stores directly — no separate provider needed.)
- [ ] **Step 3:** `pnpm typecheck` + `pnpm lint` clean (don't wire into layout yet — that's Task 4).
- [ ] **Step 4:** Commit — `feat(brand): add logo and app providers`.

---

## Task 3: Site chrome — AnnouncementBar, Navbar, MobileNav

**Files:** Create `src/components/layout/{announcement-bar,navbar,mobile-nav}.tsx`.

**Interfaces — Consumes:** `SITE`, `MAIN_NAV` (`@/lib/site`), `isActivePath` (`@/lib/navigation`), `useUiStore`/`useCartStore` (`@/store`), `Logo`, `Container`, shadcn `Button`/`Sheet`, lucide icons. **Produces:** `AnnouncementBar()`, `Navbar()`, `MobileNav()`.

- [ ] **Step 1:** `AnnouncementBar` — slim `bg-secondary text-secondary-foreground` strip, centered `font-mono` text (e.g. `SITE.tagline` or "Single-origin coffee · Italian · Indian · fusion kitchen"); `text-xs`.
- [ ] **Step 2:** `Navbar` — `"use client"`; sticky `top-0 z-40` with `bg-background/80 backdrop-blur border-b border-border`; left `Logo` (links `/`); center/right `MAIN_NAV` links (desktop `hidden md:flex`) with active state via `isActivePath(pathname, href)` (`usePathname`) → `text-brand font-medium` else `text-foreground/80 hover:text-brand`; right icon buttons (lucide `Search`, `User`, `ShoppingBag`) min 44px, `aria-label`ed. Cart button calls `useUiStore.getState().setCartOpen(true)` and shows a count badge from `selectCartCount` — **mounted-guarded** (only render the numeric badge after a mount `useEffect`, with `cd-badge-bounce` on change). Search button → `setSearchOpen(true)`; User → link `/account`. Mobile: render `<MobileNav/>` trigger (`Menu` icon) `md:hidden`.
- [ ] **Step 3:** `MobileNav` — `"use client"`; shadcn `Sheet` (side left) opened from a trigger; lists `MAIN_NAV` + quick links (Reserve, Account); closes on navigate; uses `useUiStore.mobileNavOpen`/`setMobileNavOpen` OR local Sheet state (simpler: local state inside MobileNav, expose the trigger button).
- [ ] **Step 4:** `pnpm typecheck` + `pnpm lint` clean. (Not wired into layout yet.)
- [ ] **Step 5:** Commit — `feat(layout): add announcement bar, navbar and mobile nav`.

---

## Task 4: Footer + SiteShell + layout integration

**Files:** Create `src/components/layout/{footer,site-shell}.tsx`. Modify `src/app/layout.tsx`.

**Interfaces — Consumes:** `SITE`, `FOOTER_LINKS` (`@/lib/site`), `isOpenNow` (`@/lib/hours`), `Container`, `Logo`, shadcn `Input`/`Button`, `toast` (sonner), lucide socials. **Produces:** `Footer()`, `SiteShell({children})`.

- [ ] **Step 1:** `Footer` — `bg-secondary text-secondary-foreground`; top row: `Logo` + short brand blurb + an **"Open now / Closed"** pill computed via `isOpenNow(SITE.hours, new Date())` (**mounted-guarded**, basil dot when open, muted when closed) + today's hours; columns from `FOOTER_LINKS` (Explore/Company/Legal); a compact newsletter form (email `Input` + `Button`) that on submit `toast.success("You're on the list — see you at the counter.")` and clears; social icon links (lucide `Instagram`/`Facebook`) with `aria-label`; bottom bar: `© <year> SITE.name`, address. Year computed at render.
- [ ] **Step 2:** `SiteShell` — composes `<AnnouncementBar/>` + `<Navbar/>` + `<main className="flex-1">{children}</main>` + `<Footer/>` as a column filling min height.
- [ ] **Step 3:** Modify `src/app/layout.tsx` — wrap `<body>` content: `<Providers><SiteShell>{children}</SiteShell></Providers>`. Keep existing font variables + metadata. (Remove the standalone placeholder styling assumptions — `page.tsx` still renders the placeholder until Task 12.)
- [ ] **Step 4:** `pnpm build` succeeds; visit `/` via `timeout 25 pnpm dev` (backgrounded) and confirm shell (announcement + sticky nav + footer with Open-now) renders with no console/hydration errors. `pnpm typecheck`+`lint` clean.
- [ ] **Step 5:** Commit — `feat(layout): add footer and site shell; wire providers + shell into root layout`.

---

## Task 5: `use-parallax` hook (the motion engine)

**Files:** Create `src/features/use-parallax.ts` + `src/features/use-parallax.test.ts`.

**Interfaces — Produces:**
- `parallaxProgress(rect, viewportH): number` — pure helper returning the stage's scroll progress clamped to `[0,1]` (0 when the stage top is at viewport top, 1 when its bottom reaches viewport bottom). Exported for testing.
- `useParallax(ref): void` — `"use client"`; on scroll/resize (rAF-throttled) computes progress for `ref` and writes it to the element as the CSS variable `--p` (and `--p-eased`). No-op (sets `--p:0`) when `prefers-reduced-motion`.

- [ ] **Step 1:** Write `use-parallax.test.ts` for `parallaxProgress`:
```ts
import { describe, expect, it } from "vitest";
import { parallaxProgress } from "./use-parallax";
const rect = (top: number, height: number) => ({ top, height, bottom: top + height } as DOMRect);
describe("parallaxProgress", () => {
  it("is 0 when stage top aligns with viewport top", () => { expect(parallaxProgress(rect(0, 1000), 800)).toBeCloseTo(0); });
  it("approaches 1 as the stage scrolls past", () => { expect(parallaxProgress(rect(-200, 1000), 800)).toBeGreaterThan(0); });
  it("clamps to [0,1]", () => {
    expect(parallaxProgress(rect(-100000, 1000), 800)).toBe(1);
    expect(parallaxProgress(rect(100000, 1000), 800)).toBe(0);
  });
});
```
- [ ] **Step 2:** Run → RED.
- [ ] **Step 3:** Implement:
```ts
"use client";
import { useEffect } from "react";

/** Scroll progress of a tall sticky stage, clamped to [0,1]. */
export function parallaxProgress(rect: { top: number; height: number }, viewportH: number): number {
  const scrollable = rect.height - viewportH;
  if (scrollable <= 0) return 0;
  const scrolled = -rect.top;
  return Math.min(1, Math.max(0, scrolled / scrollable));
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useParallax(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.style.setProperty("--p", "0"); el.style.setProperty("--p-eased", "0"); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = parallaxProgress(el.getBoundingClientRect(), window.innerHeight);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--p-eased", easeOutCubic(p).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ref]);
}
```
- [ ] **Step 4:** Run → GREEN (`pnpm test src/features/use-parallax.test.ts`). `pnpm typecheck`+`lint` clean.
- [ ] **Step 5:** Commit — `feat(home): add use-parallax scroll hook`.

---

## Task 6: The parallax coffee-jar hero (centerpiece)

**Files:** Create `src/components/home/{parallax-layer,hero-parallax}.tsx`. Modify `src/mocks/images.ts` (add hero keys if missing: a café-interior backplate + a coffee jar/bag — reuse `IMG.interior`/`IMG.heroBackplate`/`IMG.heroJar`/`IMG.beans`).

**Interfaces — Consumes:** `useParallax`, `Container`, `Button`, `unsplash`/`IMG`, `next/image`, `next/link`. **Produces:** `HeroParallax()`.

- [ ] **Step 1:** `ParallaxLayer({depth, className, children, style})` — a positioned layer whose transform reads the stage's `--p`/`--p-eased` via inline CSS `calc` using a `--depth` custom prop (e.g. `transform: translate3d(0, calc(var(--p) * var(--depth, 0) * 1px), 0)`), `will-change: transform`. Keep it a thin styled wrapper.
- [ ] **Step 2:** `HeroParallax` — `"use client"`; a `relative` **sticky stage** `~180vh` (`h-[180vh]`) with an inner `sticky top-0 h-screen overflow-hidden` viewport. Attach `useParallax(stageRef)` to the stage. Inside the sticky viewport, layer (back→front):
  1. **Backplate** — `next/image` fill, softly blurred café interior + a warm cream→caramel gradient overlay; slowest (`--depth` small, slight `scale(calc(1 + var(--p)*0.06))`), `priority`.
  2. **Ambience Italy** (left) — 2–3 absolutely-positioned motif images/SVan (basil leaf, tomato, pasta curl) drifting up-left (`translate` + `cd-float`), medium depth, `aria-hidden`.
  3. **Ambience India** (right) — cardamom, star-anise, marigold drifting up-right, opposite, `aria-hidden`.
  4. **Jar** — centered coffee jar/bag `next/image`; transform `translateY(calc(var(--p-eased)*-40px)) scale(calc(1 + var(--p-eased)*0.12)) rotate(calc(var(--p)*4deg))`; a soft caramel radial glow behind it; **steam**: 3 small blurred white plumes with `animate-steam` (staggered delays). `priority`.
  5. **Headline** — fastest, slight counter-move (`translateY(calc(var(--p)*30px))`, fade `opacity: calc(1 - var(--p)*1.1)`); `font-mono` eyebrow "Specialty coffee · Italian · Indian · fusion", `font-display` H1 "Italy & India, over coffee.", subcopy, two CTAs: **View the menu** (`/menu`, primary) + **Reserve a table** (`/reserve`, outline). A subtle scroll-cue chevron at the bottom.
  - **Reduced motion:** since `useParallax` pins `--p:0`, all layers render in their resting composition — verify it reads as a clean static hero.
- [ ] **Step 3:** Add a temporary mount of `<HeroParallax/>` at the top of `app/page.tsx` (above the existing placeholder) to verify in `timeout 30 pnpm dev`: scrolling animates jar scale/rotate/lift + steam + parallax layers, no jank, no layout shift; with `prefers-reduced-motion` it's a static hero. (Final composition is Task 12.)
- [ ] **Step 4:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 5:** Commit — `feat(home): add layered-parallax coffee-jar hero`.

---

## Task 7: TrustMarquee + CuisineGrid

**Files:** Create `src/components/home/{trust-marquee,cuisine-grid}.tsx`.

**Interfaces — Consumes:** `Container`, `SectionHeading`, `Reveal`, `next/link`, `unsplash`/`IMG`, `next/image`. **Produces:** `TrustMarquee()`, `CuisineGrid()`.

- [ ] **Step 1:** `TrustMarquee` — full-bleed `bg-secondary text-secondary-foreground` strip; a track duplicated ×2 with `animate-marquee` (`cd-marquee`), `no-scrollbar`, `aria-hidden` on the duplicate; items separated by a dot: "Single-origin roastery", "Wood-fired Napoletana", "Tandoor & biryani", "Oat-first", "Open 7am daily", "The Fusion Table". `motion-reduce:` → static, wrapped row.
- [ ] **Step 2:** `CuisineGrid` — `SectionHeading` eyebrow "Three kitchens, one counter" title "Coffee, Italy & India — on one menu"; a responsive grid (1/2/4) of four cards: **Coffee**, **Italian**, **Indian**, **Fusion** — each a `Link` to `/menu?cuisine=cafe|italian|indian|fusion` with an `next/image` (from `IMG`), a `font-display` label, a one-line blurb, hover lift (`transition` 300ms, `hover:-translate-y-1`, image `group-hover:scale-105 overflow-hidden`), Italy card edged `--basil`, India card edged `--marigold`, Fusion card with a small `caramel` "signature" tag. Wrap in `Reveal` (staggered).
- [ ] **Step 3:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 4:** Commit — `feat(home): add trust marquee and cuisine grid`.

---

## Task 8: FusionCarousel + HomeItemCard

**Files:** Create `src/components/home/{home-item-card,fusion-carousel}.tsx`.

**Interfaces — Consumes:** `MenuItem` type, `formatPrice` (`@/lib/format`), `Container`, `SectionHeading`, `embla-carousel-react`, `next/image`/`next/link`, lucide. **Produces:** `HomeItemCard({item})`, `FusionCarousel({items})` (receives items as a prop — page fetches them).

- [ ] **Step 1:** `HomeItemCard` — presentational card for a `MenuItem`: `next/image` (4:3, `group-hover:scale-105`), cuisine/`chefs-special` badge, `font-display` name, one-line description (clamp 2), `formatPrice(item.price)` in `font-mono`, a small spice meter (if `item.spice`) and dietary dots; links to `/item/${item.slug}`; `w-72 shrink-0` for the rail. (Add-to-cart is Phase 3 — name+price+link only here.)
- [ ] **Step 2:** `FusionCarousel` — `"use client"`; `SectionHeading` eyebrow "The Fusion Table" title "Italian, cooked in Indian style" with an action link to `/collections/the-fusion-table`; an embla carousel of `HomeItemCard`s with prev/next icon buttons (`aria-label`ed, ≥44px) and `embla` options `{ align: "start", dragFree: true }`; `no-scrollbar`; graceful when `items` is short.
- [ ] **Step 3:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 4:** Commit — `feat(home): add fusion carousel and home item card`.

---

## Task 9: StorySection + StatCounters

**Files:** Create `src/components/home/{stat-counters,story-section}.tsx`.

**Interfaces — Consumes:** `CountUp`, `Container`, `SectionHeading`, `Reveal`, `next/image`. **Produces:** `StatCounters()`, `StorySection()`.

- [ ] **Step 1:** `StatCounters` — a row of 3–4 stats using `CountUp` (e.g. "12 farms partnered", "3 cuisines, one kitchen", "7am opens daily", "2,400+ cups a week") with `font-display` numbers (`tabular-nums`) + `font-mono` labels; `Reveal`-wrapped.
- [ ] **Step 2:** `StorySection` — a two-column editorial block on `bg-muted`: left a tall `next/image` (roastery/kitchen) with a subtle parallax-on-reveal feel (CSS only — `group-hover`/reveal translate, NOT the scroll hook); right `SectionHeading` eyebrow "From bean to plate" title "Where Italy meets India over a slow roast", 2 short paragraphs telling the fusion origin story, then `<StatCounters/>`, then a "Read our story" link → `/about`.
- [ ] **Step 3:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 4:** Commit — `feat(home): add bean-to-plate story section with animated stats`.

---

## Task 10: SeasonalBanner + Testimonials

**Files:** Create `src/components/home/{seasonal-banner,testimonials}.tsx`.

**Interfaces — Consumes:** `Review` type, `Container`, `SectionHeading`, `Reveal`, `Button`, `next/image`/`next/link`, lucide `Star`. **Produces:** `SeasonalBanner()`, `Testimonials({reviews})`.

- [ ] **Step 1:** `SeasonalBanner` — full-bleed image band with a dark scrim (`bg-secondary/60`), centered `font-display` headline (e.g. "This season: Cardamom Rose Latte & Saffron Tiramisù"), subcopy, CTA `Link` to `/collections/seasonal`; `text-secondary-foreground`; respects reduced motion (no parallax; static).
- [ ] **Step 2:** `Testimonials` — `SectionHeading` eyebrow "Loved by regulars" title "Two worlds, one happy table"; a responsive grid of review cards (`Review`): rating stars (filled to `review.rating`, `aria-label` "{rating} out of 5"), `font-display` quote body, author + date (`formatDate`); `Reveal` staggered. Receives `reviews` as a prop.
- [ ] **Step 3:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 4:** Commit — `feat(home): add seasonal banner and testimonials`.

---

## Task 11: ReserveCta + NewsletterSection + GalleryStrip

**Files:** Create `src/components/home/{reserve-cta,newsletter-section,gallery-strip}.tsx`. Modify `src/mocks/images.ts` (ensure 5–6 `IMG` gallery keys exist).

**Interfaces — Consumes:** `Container`, `SectionHeading`, `Button`, `Input`, `toast`, `unsplash`/`IMG`, `next/image`/`next/link`. **Produces:** `ReserveCta()`, `NewsletterSection()`, `GalleryStrip()`.

- [ ] **Step 1:** `ReserveCta` — the narrative **climax**: full-bleed warm `bg-primary text-primary-foreground` band, `font-display` "Pull up a chair", subcopy about booking a table, large **Reserve a table** CTA → `/reserve`, secondary "See the menu" → `/menu`. Generous spacing, one primary CTA.
- [ ] **Step 2:** `NewsletterSection` — `"use client"`; centered `SectionHeading` "Get the seasonal drop"; email `Input` + `Button` form; on submit `toast.success(...)`, clear, disabled-while-pending micro-state; helper text under the field.
- [ ] **Step 3:** `GalleryStrip` — a horizontally-scrollable (`no-scrollbar`, snap) or masonry strip of 5–6 `next/image` café/dish shots from `IMG`, each with `alt`; a small "@cafedolito" `font-mono` label + link. `loading="lazy"` (below fold).
- [ ] **Step 4:** `pnpm build`+`typecheck`+`lint` clean.
- [ ] **Step 5:** Commit — `feat(home): add reservation CTA, newsletter and gallery strip`.

---

## Task 12: Compose the landing page

**Files:** Rewrite `src/app/page.tsx` (RSC).

**Interfaces — Consumes:** `menuService` (fusion items), `reviewService` (testimonials), all `home/*` sections, `Reveal`.

- [ ] **Step 1:** `page.tsx` — server component: `const [fusion, reviews] = await Promise.all([menuService.list({ cuisine: ["fusion"] }), reviewService.list()])`. Compose in narrative order, each non-hero section wrapped in `<Reveal>`:
  `<HeroParallax/>` → `<TrustMarquee/>` → `<CuisineGrid/>` → `<FusionCarousel items={fusion.items}/>` → `<StorySection/>` → `<SeasonalBanner/>` → `<Testimonials reviews={reviews}/>` → `<ReserveCta/>` → `<NewsletterSection/>` → `<GalleryStrip/>`. Remove the old placeholder.
- [ ] **Step 2:** Set page-level `metadata` (title/description from `SITE`, OpenGraph). Ensure exactly one `<h1>` (in the hero); section titles are `<h2>`.
- [ ] **Step 3:** Full verification: `pnpm build` (succeeds, `/` static or dynamic as services allow), `pnpm typecheck`, `pnpm lint`, `pnpm test` (all still green). Then `timeout 35 pnpm dev` and manually confirm: hero is alive on scroll; sections reveal on scroll; marquee/carousel/counters work; **toggle `prefers-reduced-motion`** → everything renders statically and readably; check 375px / 768px / 1280px widths; no console/hydration errors; no CLS from images.
- [ ] **Step 4:** Commit — `feat(home): compose brand landing page (hero + storytelling sections)`.

---

## Self-Review (run after authoring)
- **Spec coverage:** shell (nav/footer) ✓, parallax hero ✓ (use-parallax + hero), all spec'd home sections ✓, RSC fetch + Reveal composition ✓, reduced-motion + a11y + tokens enforced per task.
- **Placeholder scan:** none — each task names exact files, behaviors, tokens, and acceptance; the one piece of real logic (`use-parallax`) ships complete code + TDD.
- **Type/interface consistency:** `Reveal`/`Container`/`SectionHeading`/`CountUp` produced in T1 and consumed T6–T12; `useParallax` produced T5 used T6; `FusionCarousel`/`Testimonials` take props fetched in T12; `HomeItemCard` consumes `MenuItem` + `formatPrice` (both Phase-1). Cart-count/Open-now are mounted-guarded per the hydration constraint.

## Next: Phase 3 — Commerce (menu/catalog, item detail, cart drawer, checkout, success).
