# Café Dolitó — Design Spec

- **Status:** Draft for review
- **Date:** 2026-06-23
- **Author:** Claude (brainstormed with user)
- **Reference architecture:** `/Users/prashant/Documents/PP/clothing_app` (mirror its stack, layering, and principles)

---

## 1. Concept & Positioning

**Café Dolitó** is a specialty-coffee **café at its soul** with an all-day **kitchen** running three culinary threads:

1. **Italian** — authentic antipasti, pasta, pizza, risotto, dolci.
2. **Indian** — street chaat, curries, tandoor, biryani, breads, mithai.
3. **Fusion — "Italian, cooked in Indian style"** — the signature differentiator and headline hook (e.g. *Tandoori Chicken Pizza, Butter-Chicken Risotto, Masala Arrabbiata, Paneer Lasagna, Gulab Jamun Tiramisù, Masala Chai Affogato*).

Coffee remains the **brand centerpiece** (coffee-brown identity, the alive parallax coffee-jar hero). The kitchen is the **experience**; the fusion table is the **story**. Italy-meets-India is expressed visually (basil & tomato vs. cardamom, star-anise & marigold) swirling around the coffee at the hero's center.

- **Name / tagline:** Café Dolitó — *"Slow-roasted coffee. Italy & India, one table."*
- **Secondary descriptor:** *Specialty coffee · Italian · Indian · fusion kitchen.*
- **Aesthetic:** Warm artisanal (cozy, handcrafted, espresso & cream, subtle grain).
- **All brand strings live in `src/lib/site.ts`** and are trivially editable.

### Goals
- Full-fledged site: brand/marketing **+ online ordering** (cart → checkout) **+ table reservations**.
- Mirror `clothing_app`'s stack, architecture, file layout, naming, and coding principles exactly.
- A landing page that reads as **brand promotion**, anchored by a **layered-parallax coffee-jar hero** that "feels alive" on scroll.
- **Unsplash** public imagery throughout for a real, photographed feel.
- Accessible (WCAG-minded), `prefers-reduced-motion`-safe, pure logic unit-tested.

### Non-goals (mocked or out of scope)
- No real backend, payments, or auth — all mocked via a services layer + `localStorage` (exactly like clothing_app).
- No CMS, i18n, or live maps API (use a static/embedded map + address).
- No blog/journal in v1 (notable future add; intentionally cut for scope — YAGNI).

---

## 2. Tech Stack & Architecture (mirror clothing_app)

- **Package manager: pnpm (always).** Every command uses `pnpm` (`pnpm install`, `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`). Honor `pnpm-workspace.yaml`.
- **Framework:** Next.js **16.2.9** (App Router, RSC, thin route files). ⚠️ This is a modified Next.js 16 — consult `node_modules/next/dist/docs/` before using unfamiliar APIs; heed deprecations (per clothing_app `AGENTS.md`).
- **UI:** React **19.2.4**, Tailwind CSS **v4** (`@tailwindcss/postcss`), shadcn/ui **v4** (`radix-nova` style, base color neutral, CSS variables), `radix-ui`, `lucide-react`.
- **State:** `zustand` **v5** + `persist`. **Forms:** `react-hook-form` + `zod` v4 + `@hookform/resolvers`. **Carousel:** `embla-carousel-react`. **Toasts:** `sonner`. **Theme infra:** `next-themes` (light-only here). **Utils:** `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`.
- **Testing:** Vitest **v4** + Testing Library + jsdom; co-located `*.test.ts(x)`; coverage on `lib/ services/ store/`.
- **Language:** TypeScript strict; path alias `@/* → ./src/*`.

### Layering (same as clothing_app)
```
app/        thin route files that compose feature components (RSC by default)
components/ ui/ (shadcn primitives) + feature folders ("use client" only where needed)
features/   logic-heavy React hooks (facades over stores + services)
services/   mock async API (withDelay) returning fully-typed data
store/      zustand slices (+ persist) — one concern each
lib/        pure, framework-free, heavily unit-tested helpers
mocks/      deterministic datasets (menu items, categories, users, images)
types/      shared domain types (single barrel, no default export)
test/       vitest setup (jsdom, matchMedia stub, cleanup)
```

### Principles (inherited)
- Small, single-responsibility files (**≤ ~400 lines**); split when a file grows.
- **Thin routes**, logic in services/stores/lib; **reusable** components.
- **Accessibility first** (semantic HTML, aria, roles, focus states).
- **All motion** respects `prefers-reduced-motion`; transform/opacity-only animation.
- **Test pure logic** (lib/services/stores). Routes/components stay thin enough to not need heavy testing.

---

## 3. Brand & Design System

### Color tokens (light-mode only; coffee-brown primary)
Defined as CSS custom properties in `src/app/globals.css` `:root`, mapped via `@theme inline` (mirrors clothing_app's token pattern, incl. an AA-safe `--brand` for text since mid-brown fails contrast as body text).

| Token | Hex | Role |
|---|---|---|
| `--background` | `#FAF4EC` | warm cream page |
| `--foreground` | `#2A1A11` | espresso ink text |
| `--card` / `--popover` | `#FFFDFA` | surfaces |
| `--primary` | `#6F4E37` | **coffee brown** — buttons, key accents |
| `--primary-foreground` | `#FBF5EC` | cream text on coffee |
| `--brand` | `#4A3020` | AA-safe espresso for links/text on cream |
| `--secondary` | `#3A2417` | deep espresso (dark sections) |
| `--secondary-foreground` | `#F3E9DC` | cream on espresso |
| `--accent` | `#E7D2B6` | caramel/latte soft highlight |
| `--accent-foreground` | `#4A3020` | |
| `--muted` | `#F1E7D8` | oat subtle surface |
| `--muted-foreground` | `#7C6A57` | taupe secondary text |
| `--caramel` | `#C68A4E` | warm pop (badges, accents) |
| `--basil` | `#5B7B53` | Italian motif / success |
| `--marigold` | `#E1A53A` | Indian motif / highlight |
| `--destructive` | `#B23A2E` | errors |
| `--border` / `--input` | `#E7DAC8` | hairlines / fields |
| `--ring` | `#6F4E37` | focus ring |
| `--radius` | `0.6rem` | base radius |

> The Italian (`--basil`) and Indian (`--marigold`) accents are used sparingly to signal the dual-cuisine identity (e.g. cuisine tags, the fusion section, hero ambience).

### Typography (via `next/font/google`, font-variable pattern)
- **Display / headlines:** **Fraunces** (`--font-fraunces`) — warm old-style serif, optical sizing. Maps to `--font-display`.
- **UI / body:** **Manrope** (`--font-manrope`) — humanist sans. Maps to `--font-sans`.
- **Labels / prices / eyebrows:** **Geist Mono** (`--font-geist-mono`) → `--font-mono`.

### `globals.css` structure (Tailwind v4)
```
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@theme inline { /* --color-* ← var(--*), --font-*, --radius-* */ }
:root { /* design tokens above */ }
@layer base { *, body, html(smooth scroll) ; prefers-reduced-motion reset }
@layer utilities { .font-display, .text-balance, .no-scrollbar, .animate-* }
@keyframes cd-marquee / cd-steam / cd-float / cd-heart-pop / cd-badge-bounce / cd-shimmer
```

---

## 4. Information Architecture (App Router routes)

```
/                         landing — brand promo + parallax coffee-jar hero
/menu                     full menu = orderable catalog (filter by cuisine/category, sort, search, quick-add)
/menu/category/[slug]     category-locked menu (e.g. pasta, biryani, fusion-signatures)
/item/[slug]              item detail (gallery, options, spice/dietary, add-to-order, related)
/collections              Italian Classics · Indian Soul · The Fusion Table · Roaster's Picks · Seasonal
/collections/[slug]
/cart                     review order
/checkout                 pickup or delivery → contact → mock payment → tip + promo
/checkout/success         confirmation (order number, ready/ETA time)
/reserve                  table reservation flow → confirmation (reference code)
/about                    the bean-to-cup + Italy-meets-India story (parallax imagery, CountUp stats)
/gallery                  photographed café & dishes
/visit                    location, hours, map, live "Open now" status
/events                   private hire & catering inquiry
/contact                  contact form
/faq                      FAQ accordion
/account                  dashboard (guarded)
/account/profile          profile edit
/account/orders           order history
/account/orders/[id]      order detail
/account/reservations     upcoming/past reservations (+ cancel)
/account/favorites        saved items
/login   /register        mock auth (demo account)
/search                   instant search across menu
/policies/[slug]          privacy · terms · allergens & dietary info
robots.ts · sitemap.ts · error.tsx · not-found.tsx
```

Route files stay thin: fetch via services in RSC, compose feature components, wrap sections in `<Reveal>`.

---

## 5. Domain Model & Data

### Core types (`src/types/index.ts`)
```ts
type ID = string;
type ItemType = "drink" | "food" | "bean";           // drives which option sets apply
type Cuisine  = "cafe" | "italian" | "indian" | "fusion";
type SpiceLevel = 0 | 1 | 2 | 3;                      // none → hot
type DietaryTag = "veg" | "vegan" | "gluten-free" | "contains-nuts"
                | "halal" | "spicy" | "chefs-special" | "seasonal" | "bestseller" | "new";

interface ItemOptionValue { id: ID; label: string; priceDelta: number; }
interface ItemOption {                                // generic — generalizes clothing_app size/color
  id: ID; name: string; type: "single" | "multi"; required?: boolean;
  values: ItemOptionValue[];
}
interface ItemImage { src: string; alt: string; }

interface MenuItem {
  id: ID; slug: string; name: string; description: string;
  type: ItemType; cuisine: Cuisine; categorySlug: string; collectionSlugs: ID[];
  price: number;                                      // base price (currency in SITE)
  images: ItemImage[];
  options: ItemOption[];                              // drink: size/milk/temp/extras · bean: weight/grind · food: portion/spice/add-ons
  dietary: DietaryTag[]; spice?: SpiceLevel; veg?: boolean;
  rating?: number; reviewCount?: number;
  prepTimeMins?: number; calories?: number; available?: boolean;
}

interface CartItem {                                  // a configured line
  key: string;                                        // itemId + sorted option value ids
  itemId: ID; slug: string; name: string; image: string;
  cuisine: Cuisine; unitPrice: number;                // base + option deltas
  selections: { optionId: ID; optionName: string; valueId: ID; valueLabel: string }[];
  quantity: number; maxQty: number; notes?: string;
}

type Fulfillment = "pickup" | "delivery";
type OrderStatus = "received" | "preparing" | "ready" | "completed";
interface OrderTotals { subtotal: number; tax: number; deliveryFee: number; tip: number; discount: number; total: number; }
interface Order { id: ID; code: string; items: CartItem[]; fulfillment: Fulfillment;
  slot?: string; address?: Address; contact: Contact; totals: OrderTotals;
  promoCode?: string; status: OrderStatus; placedAt: string; }

type ReservationStatus = "confirmed" | "seated" | "cancelled" | "completed";
interface Reservation { id: ID; reference: string; date: string; timeSlot: string;
  partySize: number; name: string; email: string; phone: string;
  occasion?: string; notes?: string; status: ReservationStatus; createdAt: string; }

interface Category { slug: string; name: string; cuisine: Cuisine; blurb?: string; image?: string; }
interface Collection { slug: string; name: string; tagline: string; image: string; itemIds: ID[]; }
interface Review { id: ID; itemSlug?: string; author: string; rating: number; body: string; date: string; }
interface MockUser { /* incl. passwordHash-ish */ } interface SessionUser { /* no secret */ }
interface Address { /* line1, city, zip... */ } interface Contact { name: string; email: string; phone: string; }
interface ProductQuery { cuisine?: Cuisine[]; category?: string; dietary?: DietaryTag[];
  spiceMax?: SpiceLevel; sort?: SortKey; q?: string; page?: number; }
type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";
interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number; }
```

### Categories (by cuisine)
- **Café:** `espresso`, `signature-lattes`, `cold-brew`, `tea-not-coffee`.
- **Italian:** `antipasti`, `pasta`, `pizza`, `risotto`, `dolci`.
- **Indian:** `chaat-street`, `curries`, `tandoor`, `biryani`, `breads`, `mithai`.
- **Fusion:** `fusion-signatures` (the "Italian in Indian style" table).
- **Retail:** `beans` (whole-bean / ground bags).

### Collections
`italian-classics` · `indian-soul` · `the-fusion-table` · `roasters-picks` (beans) · `seasonal`.

### Mock dataset (`src/mocks/`)
- ~40–55 items spread across the categories, each with realistic copy, Unsplash image refs, options, dietary/spice/veg flags, ratings. Split per cuisine file (`mocks/items/cafe.ts`, `italian.ts`, `indian.ts`, `fusion.ts`, `beans.ts`) aggregated in `mocks/items/index.ts` via a `makeItem()` factory.
- **Fusion signatures** (the headline): Tandoori Chicken Pizza, Butter-Chicken Risotto, Masala Arrabbiata, Paneer Lasagna, Tikka Pesto Penne, Keema Bolognese, Gulab Jamun Tiramisù, Masala Chai Affogato, Chai-spiced Panna Cotta.
- `categories.ts`, `collections.ts`, `reviews.ts`, `users.ts` (demo `demo@cafedolito.com` / `password123`), `palette.ts`, `images.ts` (Unsplash manifest + fallbacks), `factory.ts`.

---

## 6. State, Services, Features, Lib

### Stores (`src/store/`, zustand + persist, keys `cd:*`)
- `cart.store.ts` (`cd:cart`) — items, addItem (merge by `key`, clamp to `maxQty`), setQty, remove, clear; selectors `selectCartItems`, `selectCartCount`.
- `auth.store.ts` (`cd:auth`, partialize user) — user, status, login, register, logout, refresh, updateProfile.
- `favorites.store.ts` (`cd:favorites`) — ids, toggle, has.
- `promo.store.ts` (`cd:promo`) — applied code.
- `recently-viewed.store.ts` (`cd:recent`) — item ids.
- `ui.store.ts` (not persisted) — cartOpen, searchOpen, mobileNavOpen.

### Services (`src/services/`, mock + `withDelay`)
- `menu.service.ts` — listItems(query), getItemBySlug, listByCategory, facets, search.
- `category.service.ts`, `collection.service.ts`.
- `order.service.ts` — createOrder, listOrders(userId), getOrder (persists to localStorage).
- `reservation.service.ts` — createReservation, listReservations, availableSlots(date) (built from hours).
- `auth.service.ts` — login, register, persist (`AuthError`), demo credentials.
- `review.service.ts` — list reviews / testimonials.
- `delay.ts` — `withDelay()` latency simulation.

### Features (hooks, `src/features/`)
- `use-cart.ts` — facade: items, totals, mutators, add-with-options.
- `use-catalog.ts` — URL params ⇄ `menu.service` + filter/sort/paginate.
- `use-promo.ts` — resolve & apply promo code.
- `use-reservation.ts` — slots, submit, confirmation.
- `use-parallax.ts` — **the hero engine** (see §8).

### Lib (pure, unit-tested, `src/lib/`)
- `utils.ts` (`cn`), `site.ts` (SITE config: name, tagline, cuisines, hours, address, phone, email, socials, currency, nav, footer), `format.ts` (price/date/initials/pluralize).
- `pricing.ts` — `TAX_RATE`, `DELIVERY_FEE`, `FREE_DELIVERY_THRESHOLD`, `TIP_PRESETS`, `PROMO_CODES` (`BREW10` 10%, `MORNING15` 15%, `BEANS20` 20%, `DOLITO25` welcome 25%), `calcSubtotal`, `calcDelivery`, `resolveDiscount`, `calcTotals`.
- `menu-query.ts` (filter/sort/`COMPARATORS`), `catalog-params.ts` (parse `URLSearchParams`, `toggleCsv`, `hasActiveFilters`), `facets.ts` (derive cuisines/categories/dietary/price range).
- `hours.ts` — **`isOpenNow(hours, date)` + `nextOpenChange()`** (testable "Open now"; also feeds reservation slots).
- `storage.ts` (SSR-safe JSON read/write), `navigation.ts`.
- `validation/auth.ts` (login/register), `validation/checkout.ts` (contact/address/payment), `validation/reservation.ts` (date/time/party/contact) — all zod.
- `content/` — about story, faq, policies (privacy/terms/allergens), events copy.

---

## 7. Ordering & Checkout Flow

- **Menu / item:** configure options (drink size/milk/temp; food portion/spice/add-ons; bean weight/grind) → unit price recomputes live → add to cart (toast + badge bounce). Cart drawer (portal) + `/cart` page.
- **Checkout:** choose **Pickup** (time slot from hours) or **Delivery** (address + fee, free over threshold) → contact → **mock payment** (card fields, zod-validated, never stored) → **tip** (presets/custom) → **promo code**. Totals = subtotal + tax + delivery − discount + tip.
- **Success:** order code + ready/ETA time; persisted to history.

## 8. The Landing Hero — Layered Parallax Coffee Jar (centerpiece)

**Structure:** a tall **sticky stage (~180vh)**. `use-parallax.ts` (rAF-throttled scroll listener) computes the section's scroll progress `p ∈ [0,1]` and writes CSS custom properties; layers transform via `transform`/`opacity` only:

1. **Backplate** (slowest, `translateY` small, slight scale) — warm gradient + softly-blurred café interior (Unsplash).
2. **Ambience — Italy** (left, medium) — basil leaves, tomato, a curl of pasta drifting up.
3. **Ambience — India** (right, medium, opposite drift) — cardamom pods, star-anise, marigold petals.
4. **The jar** (center, the star) — coffee jar/bag image that **scales up, rotates a few degrees, and lifts**; continuous **CSS steam** (`cd-steam`); a soft caramel glow blooms behind it.
5. **Foreground/headline** (fastest, slight counter-move) — "Café Dolitó", tagline, CTAs **View Menu** / **Reserve a Table**.

**Reduced motion:** hook returns static; layers render as a clean composed still. **Perf:** `will-change: transform`, GPU-friendly, single rAF loop, no layout thrash.

**Below the hero (each wrapped in `<Reveal>`):** trust **marquee** ("Single-origin · Small-batch roasted · Italian & Indian kitchen · Open 7am") → featured cuisines (Italian / Indian / Fusion / Coffee) → **signature fusion carousel** (embla, quick-add) → **bean-to-cup + Italy-meets-India story** with CountUp stats → seasonal collection banner → testimonials → **"Pull up a chair" reservation CTA** → newsletter → gallery strip.

## 9. Reservations Flow
`/reserve`: zod form (date, time slot, party size, name, email, phone, occasion, notes). `reservation.service` validates against `availableSlots(date)` (derived from `hours.ts`), returns a confirmation with a **reference code**, persists under the user (or guest). `/account/reservations` lists upcoming/past with cancel.

## 10. Accounts / Auth (mock)
Mirror clothing_app: `auth.store` (persist), `AuthProvider` re-validates on mount, `AccountShell` route guard, dashboard + profile + orders + reservations + favorites. Demo: `demo@cafedolito.com` / `password123`.

## 11. Animation & Accessibility Standards
- Keyframes prefixed `cd-`; Tailwind `animate-*` utilities; `tw-animate-css` available.
- `Reveal` (IntersectionObserver) for scroll-in; `CountUp` (rAF) for stats; embla for carousels.
- **Every** animation gated by `prefers-reduced-motion`. Full keyboard nav, visible focus, aria/roles, alt text on all images.

## 12. Images — Unsplash Strategy
- `next.config.ts`: add `images.remotePatterns` for `images.unsplash.com` (keep `dangerouslyAllowSVG` + `contentDispositionType` for SVG fallbacks).
- `src/mocks/images.ts`: curated Unsplash URLs (sized `?w=…&q=80&auto=format&fit=crop`) for hero layers, each menu item, gallery, story, collections — centralized for easy swapping; each with a gradient/SVG fallback if a fetch fails.
- `next/image` with `fill` + `sizes`, `priority` above-fold, `object-cover`.

## 13. Testing Strategy
- `vitest.config.ts` (jsdom, globals, setup `src/test/setup.ts`, coverage `lib/ services/ store/`) + `matchMedia` stub.
- Co-located unit tests for **pricing, menu-query, catalog-params, facets, hours, format, validation/\***, all **stores**, and **services** (createOrder, createReservation, availableSlots, auth).

## 14. SEO & Metadata
Root `metadata` from SITE (title template, description, OpenGraph, keywords incl. "Italian", "Indian", "fusion", "coffee"); `robots.ts`, `sitemap.ts`; per-route metadata; `generateStaticParams` for `/item/[slug]`.

---

## 15. Proposed Project Structure
```
src/
  app/            (routes per §4) + layout.tsx, globals.css, robots.ts, sitemap.ts, error.tsx, not-found.tsx
  components/
    ui/           shadcn primitives (button, input, card, dialog, sheet, accordion, tabs, select, …)
    common/       container, section-heading, page-header, breadcrumb, price-tag, rating-stars,
                  quantity-stepper, empty-state, reveal, count-up
    layout/       site-shell, navbar, mega-menu (by cuisine), mobile-nav, footer, announcement-bar,
                  search-overlay, newsletter-form
    brand/        logo
    home/         hero-parallax, parallax-layer, trust-marquee, cuisine-grid, fusion-carousel,
                  story-section, stat-counters, seasonal-banner, testimonials, reserve-cta,
                  newsletter-section, gallery-strip
    menu/         menu-view, item-card, cuisine-filter, dietary-badges, spice-meter, sort-select
    item/         item-gallery, option-picker, add-to-order-panel, item-meta, related-items
    cart/         cart-drawer, cart-line
    checkout/     fulfillment-step, contact-form, payment-form, tip-picker, order-summary
    reservation/  reservation-form, slot-picker, reservation-confirmation
    account/      account-shell, order-card, reservation-card
    forms/        text-field, select-field, textarea-field
    providers/    auth-provider
  features/       use-cart, use-catalog, use-promo, use-reservation, use-parallax
  services/       menu, category, collection, order, reservation, auth, review, delay
  store/          cart, auth, favorites, promo, recently-viewed, ui
  lib/            utils, site, format, pricing, menu-query, catalog-params, facets, hours,
                  storage, navigation, validation/*, content/*
  mocks/          items/{cafe,italian,indian,fusion,beans,index}, categories, collections, reviews,
                  users, palette, images, factory
  types/          index.ts
  test/           setup.ts
docs/superpowers/specs/  this spec
+ config: package.json, pnpm-workspace.yaml, next.config.ts, tsconfig.json, postcss.config.mjs,
  eslint.config.mjs, components.json, vitest.config.ts, README.md, AGENTS.md
```

## 16. Build Phasing
1. **Scaffold** — `pnpm` Next.js 16 app, deps, configs, tokens/fonts, `globals.css`, Unsplash config, layout shell (navbar/footer/providers/toaster).
2. **Foundation** — types, mocks (incl. fusion menu), services, stores, lib (+ unit tests).
3. **Landing** — parallax coffee-jar hero + all home sections.
4. **Commerce** — menu/catalog, item detail, cart, checkout, success.
5. **Reservations** — booking flow + confirmation.
6. **Content & account** — about, gallery, visit, events, contact, faq, policies, auth, account/*.
7. **Polish** — SEO, a11y + reduced-motion pass, empty/loading states, responsive QA, `pnpm typecheck`/`lint`/`test` green.

## 17. Assumptions & Open Questions
- **Coffee stays the brand centerpiece**; the three cuisines are the kitchen/menu (hero remains the coffee jar). _If you'd rather the hero foreground the food/fusion, say so._
- Fictional brand details (address, hours, phone, socials) are realistic placeholders in `site.ts`, easily edited.
- "Italian in Indian style" = Italian dishes prepared with Indian technique/spice (the fusion category). Authentic Italian and authentic Indian also each have their own categories.
- All data is mocked (no backend); orders/reservations persist to `localStorage`.
- Light mode only (matches clothing_app); rich warm palette, no dark theme in v1.
