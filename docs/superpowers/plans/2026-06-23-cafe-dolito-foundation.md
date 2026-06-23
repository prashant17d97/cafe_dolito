# Café Dolitó — Foundation Implementation Plan (Phase 1 of 6)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a booting, fully-typed Next.js 16 app for Café Dolitó with all design tokens, domain types, mock data, a tested pure-logic `lib/` layer, mock `services/`, and zustand `store/` slices — the headless "engine" every later UI phase consumes.

**Architecture:** Mirror `/Users/prashant/Documents/PP/clothing_app` exactly — App Router (RSC, thin routes), layered `app → components → features → services → store → lib → mocks → types`. This phase builds everything below the UI: tokens, types, pure helpers (TDD), deterministic mock datasets, a mock async service layer (`withDelay`), and persisted zustand stores. UI/pages arrive in phases 2–6.

**Tech Stack:** Next.js 16.2.9 · React 19.2.4 · TypeScript 5 (strict) · Tailwind v4 · shadcn/ui v4 (`radix-nova`) · zustand 5 (+persist) · react-hook-form 7 + zod 4 · embla · sonner · Vitest 4 + Testing Library + jsdom · **pnpm**.

## Global Constraints

*(Every task implicitly includes these.)*
- **Package manager: pnpm only.** Never npm/yarn. Commands: `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- **Next.js is a modified 16.2.9** — before using any unfamiliar Next API (fonts, metadata, image, route files), read the matching guide under `node_modules/next/dist/docs/`. Heed deprecations.
- **Pin these versions** (match clothing_app): `next@16.2.9`, `react@19.2.4`, `react-dom@19.2.4`, `eslint-config-next@16.2.9`, `zod@^4.4.3`, `zustand@^5.0.14`, `react-hook-form@^7.79.0`, `@hookform/resolvers@^5.4.0`, `embla-carousel-react@^8.6.0`, `lucide-react@^1.20.0`, `next-themes@^0.4.6`, `radix-ui@^1.6.0`, `shadcn@^4.11.0`, `sonner@^2.0.7`, `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.6.0`, `tw-animate-css@^1.4.0`; dev: `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `typescript@^5`, `vitest@^4.1.9`, `@vitest/coverage-v8@^4.1.9`, `@vitejs/plugin-react@^6.0.2`, `@testing-library/react@^16.3.2`, `@testing-library/jest-dom@^6.9.1`, `@testing-library/user-event@^14.6.1`, `jsdom@^29.1.1`, `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`, `eslint@^9`.
- **Path alias** `@/* → ./src/*`.
- **Light mode only.** Coffee-brown primary `#6F4E37`; AA-safe text brand `#4A3020`.
- **No framer-motion / GSAP.** Motion = CSS keyframes + IntersectionObserver/rAF, always gated by `prefers-reduced-motion`.
- **Unsplash imagery** via `next/image` (`images.remotePatterns` for `images.unsplash.com`).
- **Files ≤ ~400 lines**, single responsibility. **Test pure logic** (`lib/ services/ store/`); co-locate `*.test.ts`.
- **Currency:** USD. **Brand strings** live only in `src/lib/site.ts`.

---

## File Structure (this phase)

```
package.json · pnpm-workspace.yaml · next.config.ts · tsconfig.json · postcss.config.mjs
eslint.config.mjs · vitest.config.ts · components.json · AGENTS.md · CLAUDE.md · README.md
src/
  app/         layout.tsx · page.tsx (placeholder) · globals.css
  components/ui/   (shadcn primitives via CLI)
  lib/         utils · format · storage · site · hours · pricing · menu-query ·
               catalog-params · facets · navigation · validation/{auth,checkout,reservation}
               (+ co-located *.test.ts)
  services/    delay · menu · category · collection · order · reservation · auth · review
               (+ *.test.ts)
  store/       ui · cart · favorites · promo · recently-viewed · auth (+ *.test.ts)
  mocks/       factory · categories · collections · reviews · users · images ·
               items/{cafe,italian,indian,fusion,beans,index}
  types/       index.ts
  test/        setup.ts
```

---

## Task 1: Project scaffold & configuration

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `components.json`, `AGENTS.md`, `CLAUDE.md`, `src/test/setup.ts`

**Interfaces:**
- Produces: a runnable workspace; path alias `@/*`; `pnpm test` harness; Unsplash image config.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "cafe_dolito",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^1.20.0",
    "next": "16.2.9",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.6.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.79.0",
    "shadcn": "^4.11.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.2",
    "@vitest/coverage-v8": "^4.1.9",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "jsdom": "^29.1.1",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.9"
  }
}
```

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

- [ ] **Step 3: Create `next.config.ts`** (Unsplash remote images + SVG fallback)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    // Local placeholders are trusted, generated SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: Create `eslint.config.mjs`**

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // Mock services intentionally use effect + setState.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
```

- [ ] **Step 7: Create `vitest.config.ts`** (explicit `@` alias so tests resolve imports)

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/services/**", "src/store/**"],
    },
  },
});
```

- [ ] **Step 8: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// jsdom lacks matchMedia; stub it for components/hooks that read it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
```

- [ ] **Step 9: Create `components.json`** (shadcn v4, radix-nova)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

- [ ] **Step 10: Create `AGENTS.md` and `CLAUDE.md`**

`AGENTS.md`:
```md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Café Dolitó
- Package manager: **pnpm only**.
- Specialty-coffee café + Italian/Indian/"Italian in Indian style" fusion kitchen.
- Mirror the architecture & principles of ../clothing_app. Light mode only. Coffee-brown primary (#6F4E37).
- Motion via CSS + rAF/IntersectionObserver (no framer-motion); always honor prefers-reduced-motion.
```

`CLAUDE.md`:
```md
@AGENTS.md
```

- [ ] **Step 11: Install dependencies**

Run: `pnpm install`
Expected: resolves and installs without error; creates `pnpm-lock.yaml` and `node_modules/`.

- [ ] **Step 12: Verify the test harness runs**

Run: `pnpm test`
Expected: Vitest runs and reports **"No test files found"** (exit 0) — harness wired, no tests yet.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + pnpm workspace and tooling config"
```

---

## Task 2: Design tokens, fonts, globals.css & booting layout

**Files:**
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Produces: CSS custom-property design tokens (`--primary` etc.), font variables `--font-fraunces|manrope|geist-mono`, `cd-*` keyframes, utility classes (`.font-display`, `.no-scrollbar`, `.animate-marquee`, …). A booting, styled page.

- [ ] **Step 1: Create `src/app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/*
  Café Dolitó design tokens — light mode only. Warm-artisanal.
  Coffee-brown primary (#6F4E37). `--brand` is the AA-safe espresso for body
  text/links on cream. Italian (basil) + Indian (marigold) accents signal the
  dual-cuisine identity, used sparingly.
*/

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-caramel: var(--caramel);
  --color-basil: var(--basil);
  --color-marigold: var(--marigold);
  --color-ink: var(--ink);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --font-sans: var(--font-manrope);
  --font-display: var(--font-fraunces);
  --font-mono: var(--font-geist-mono);

  --radius-sm: calc(var(--radius) * 0.5);
  --radius-md: calc(var(--radius) * 0.75);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.5);
  --radius-2xl: calc(var(--radius) * 2);
}

:root {
  --radius: 0.6rem;

  --background: #faf4ec;       /* warm cream */
  --foreground: #2a1a11;       /* espresso ink */

  --card: #fffdfa;
  --card-foreground: #2a1a11;
  --popover: #fffdfa;
  --popover-foreground: #2a1a11;

  --primary: #6f4e37;          /* coffee brown */
  --primary-foreground: #fbf5ec;

  --secondary: #3a2417;        /* deep espresso */
  --secondary-foreground: #f3e9dc;

  --muted: #f1e7d8;            /* oat */
  --muted-foreground: #7c6a57; /* taupe */

  --accent: #e7d2b6;           /* caramel/latte */
  --accent-foreground: #4a3020;

  --destructive: #b23a2e;
  --success: #5b7b53;

  --brand: #4a3020;            /* AA-safe espresso for text/links */
  --brand-foreground: #ffffff;
  --caramel: #c68a4e;
  --basil: #5b7b53;            /* Italian motif */
  --marigold: #e1a53a;         /* Indian motif */
  --ink: #2a1a11;

  --border: #e7dac8;
  --input: #e7dac8;
  --ring: #6f4e37;
}

@layer base {
  * {
    @apply border-border outline-ring/60;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  html {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  .font-display { font-family: var(--font-display); }
  .text-balance { text-wrap: balance; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .animate-marquee { animation: cd-marquee 30s linear infinite; }
  .animate-steam { animation: cd-steam 3.2s ease-in-out infinite; }
  .animate-float { animation: cd-float 6s ease-in-out infinite; }
  .animate-heart-pop { animation: cd-heart-pop 0.4s ease-out; }
  .animate-badge-bounce { animation: cd-badge-bounce 0.45s ease-out; }
}

@keyframes cd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes cd-steam {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  30% { opacity: 0.55; }
  100% { transform: translateY(-46px) scaleX(1.5); opacity: 0; }
}
@keyframes cd-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}
@keyframes cd-heart-pop {
  0% { transform: scale(1); } 35% { transform: scale(1.35); }
  60% { transform: scale(0.9); } 100% { transform: scale(1); }
}
@keyframes cd-badge-bounce {
  0% { transform: scale(1); } 40% { transform: scale(1.4); }
  70% { transform: scale(0.85); } 100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-heart-pop, .animate-badge-bounce, .animate-steam, .animate-float { animation: none; }
}
```

- [ ] **Step 2: Create `src/app/layout.tsx`** (fonts + metadata + body shell)

> Before editing, skim `node_modules/next/dist/docs/` for the font/metadata guide if anything below errors.

```tsx
import type { Metadata } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Café Dolitó — Slow-roasted coffee. Italy & India, one table.",
  description:
    "Specialty coffee café and kitchen — authentic Italian, Indian, and Italian-in-Indian-style fusion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create placeholder `src/app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">Café Dolitó</p>
      <h1 className="font-display text-5xl font-semibold text-foreground sm:text-7xl">
        Slow-roasted coffee.
        <br />
        Italy &amp; India, one table.
      </h1>
      <p className="max-w-md text-muted-foreground">
        Foundation online. Landing page and menu arrive in the next phases.
      </p>
      <span className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
        Coffee · Italian · Indian · Fusion
      </span>
    </main>
  );
}
```

- [ ] **Step 4: Verify it compiles (non-blocking)**

The authoritative check is the production build in Step 5. Optionally start the dev server **backgrounded/timeboxed** so it cannot hang a headless run — e.g. `timeout 25 pnpm dev` — and confirm the output reports a successful compile with no errors. Do not block on the long-running server.

- [ ] **Step 5: Production build sanity**

Run: `pnpm build`
Expected: compiles successfully (the `/` route is statically rendered).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, fonts, globals.css and booting layout"
```

---

## Task 3: shadcn/ui primitives

**Files:**
- Create (via CLI): `src/components/ui/{button,input,label,textarea,card,badge,separator,sheet,dialog,dropdown-menu,accordion,tabs,select,checkbox,radio-group,skeleton,sonner,avatar,tooltip}.tsx`
- Create: `src/lib/utils.ts` (the CLI expects it; create first)

**Interfaces:**
- Produces: styled primitives importing `cn` from `@/lib/utils`; `Toaster` from `@/components/ui/sonner`.

- [ ] **Step 1: Create `src/lib/utils.ts`** (needed by every primitive)

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Add primitives with the shadcn CLI** (reads `components.json` → radix-nova)

Run:
```bash
pnpm dlx shadcn@latest add button input label textarea card badge separator sheet dialog dropdown-menu accordion tabs select checkbox radio-group skeleton sonner avatar tooltip --yes
```
Expected: files created under `src/components/ui/`. If the CLI prompts to overwrite `globals.css`, choose **No** (we own it).

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: passes (0 errors).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui primitives (radix-nova) and cn util"
```

---

## Task 4: Domain types

**Files:**
- Create: `src/types/index.ts`

**Interfaces:**
- Produces: all shared types consumed by lib/services/stores/mocks: `ID`, `ItemType`, `Cuisine`, `SpiceLevel`, `DietaryTag`, `ItemOption`, `ItemOptionValue`, `ItemImage`, `MenuItem`, `CartItem`, `Category`, `Collection`, `Review`, `MockUser`, `SessionUser`, `Address`, `Contact`, `Fulfillment`, `OrderStatus`, `OrderTotals`, `Order`, `ReservationStatus`, `Reservation`, `SortKey`, `ProductQuery`, `Paginated<T>`, `Hours`, `DayHours`.

- [ ] **Step 1: Create `src/types/index.ts`**

```ts
export type ID = string;

export type ItemType = "drink" | "food" | "bean";
export type Cuisine = "cafe" | "italian" | "indian" | "fusion";
export type SpiceLevel = 0 | 1 | 2 | 3; // none → hot
export type DietaryTag =
  | "veg" | "vegan" | "gluten-free" | "contains-nuts" | "halal"
  | "spicy" | "chefs-special" | "seasonal" | "bestseller" | "new";

export interface ItemOptionValue { id: ID; label: string; priceDelta: number; }
export interface ItemOption {
  id: ID;
  name: string;
  type: "single" | "multi";
  required?: boolean;
  values: ItemOptionValue[];
}
export interface ItemImage { src: string; alt: string; }

export interface MenuItem {
  id: ID;
  slug: string;
  name: string;
  description: string;
  type: ItemType;
  cuisine: Cuisine;
  categorySlug: string;
  collectionSlugs: ID[];
  price: number;
  images: ItemImage[];
  options: ItemOption[];
  dietary: DietaryTag[];
  spice?: SpiceLevel;
  veg?: boolean;
  rating?: number;
  reviewCount?: number;
  prepTimeMins?: number;
  calories?: number;
  available?: boolean;
}

export interface CartSelection {
  optionId: ID; optionName: string; valueId: ID; valueLabel: string; priceDelta: number;
}
export interface CartItem {
  key: string;            // itemId + sorted value ids
  itemId: ID;
  slug: string;
  name: string;
  image: string;
  cuisine: Cuisine;
  unitPrice: number;      // base + selected deltas
  selections: CartSelection[];
  quantity: number;
  maxQty: number;
  notes?: string;
}

export interface Category { slug: string; name: string; cuisine: Cuisine; blurb?: string; image?: string; }
export interface Collection { slug: string; name: string; tagline: string; image: string; itemIds: ID[]; }
export interface Review { id: ID; itemSlug?: string; author: string; rating: number; body: string; date: string; }

export interface Address { line1: string; line2?: string; city: string; state: string; zip: string; }
export interface Contact { name: string; email: string; phone: string; }

export interface MockUser { id: ID; firstName: string; lastName: string; email: string; password: string; }
export interface SessionUser { id: ID; firstName: string; lastName: string; email: string; }

export type Fulfillment = "pickup" | "delivery";
export type OrderStatus = "received" | "preparing" | "ready" | "completed";
export interface OrderTotals {
  subtotal: number; tax: number; deliveryFee: number; tip: number; discount: number; total: number;
}
export interface Order {
  id: ID; code: string; items: CartItem[]; fulfillment: Fulfillment;
  slot?: string; address?: Address; contact: Contact; totals: OrderTotals;
  promoCode?: string; status: OrderStatus; placedAt: string;
}

export type ReservationStatus = "confirmed" | "seated" | "cancelled" | "completed";
export interface Reservation {
  id: ID; reference: string; date: string; timeSlot: string; partySize: number;
  name: string; email: string; phone: string; occasion?: string; notes?: string;
  status: ReservationStatus; createdAt: string;
}

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";
export interface ProductQuery {
  cuisine?: Cuisine[]; category?: string; dietary?: DietaryTag[];
  spiceMax?: SpiceLevel; sort?: SortKey; q?: string; page?: number;
}
export interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number; }

/** Weekly opening hours: index 0 = Sunday … 6 = Saturday. null = closed that day. */
export interface DayHours { open: string; close: string; } // "07:00", "22:00"
export type Hours = (DayHours | null)[];
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add shared domain types"
```

---

## Task 5: Pure `lib/` helpers (TDD)

**Files:**
- Create + Test: `src/lib/{format,storage,site,hours,pricing,menu-query,catalog-params,facets,navigation}.ts` and matching `*.test.ts`; `src/lib/validation/{auth,checkout,reservation}.ts`.

**Interfaces:**
- Consumes: `@/types`.
- Produces (exact signatures later tasks rely on):
  - `format.ts`: `formatPrice(amount: number, currency?: string): string`, `formatDate(iso: string): string`, `initials(name: string): string`, `pluralize(n: number, word: string): string`.
  - `storage.ts`: `readJSON<T>(key: string, fallback: T): T`, `writeJSON(key: string, value: unknown): void`, `removeKey(key: string): void`.
  - `site.ts`: `SITE` (object incl. `hours: Hours`), `MAIN_NAV`, `FOOTER_LINKS`.
  - `hours.ts`: `isOpenNow(hours: Hours, now: Date): boolean`, `generateSlots(hours: Hours, date: Date, stepMins?: number): string[]`.
  - `pricing.ts`: `TAX_RATE`, `DELIVERY_FEE`, `FREE_DELIVERY_THRESHOLD`, `TIP_PRESETS`, `PROMO_CODES`, `calcSubtotal(items)`, `calcDelivery(subtotal, fulfillment)`, `resolveDiscount(subtotal, code)`, `calcTotals(args)`.
  - `menu-query.ts`: `filterItems(items, query)`, `sortItems(items, sort)`, `paginate(items, page, pageSize)`, `DEFAULT_PAGE_SIZE`.
  - `catalog-params.ts`: `parseProductQuery(sp: URLSearchParams): ProductQuery`, `toggleCsv(csv, value)`, `hasActiveFilters(q): boolean`.
  - `facets.ts`: `buildFacets(items): { cuisines, categories, dietary, priceRange }`.

- [ ] **Step 1: Write `src/lib/format.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { formatPrice, formatDate, initials, pluralize } from "./format";

describe("format", () => {
  it("formats USD price", () => { expect(formatPrice(6.5)).toBe("$6.50"); });
  it("formats whole price", () => { expect(formatPrice(12)).toBe("$12.00"); });
  it("formats a date", () => { expect(formatDate("2026-06-23T10:00:00.000Z")).toMatch(/2026/); });
  it("derives initials", () => { expect(initials("Marco Rossi")).toBe("MR"); });
  it("pluralizes", () => {
    expect(pluralize(1, "table")).toBe("1 table");
    expect(pluralize(2, "table")).toBe("2 tables");
  });
});
```

- [ ] **Step 2: Run it — verify failure**

Run: `pnpm test src/lib/format.test.ts`
Expected: FAIL — cannot find module `./format`.

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(iso));
}
export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
```

- [ ] **Step 4: Run it — verify pass**

Run: `pnpm test src/lib/format.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Write `src/lib/storage.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { readJSON, writeJSON, removeKey } from "./storage";

describe("storage", () => {
  it("returns fallback when key missing", () => { expect(readJSON("nope", 42)).toBe(42); });
  it("round-trips a value", () => {
    writeJSON("k", { a: 1 });
    expect(readJSON("k", null)).toEqual({ a: 1 });
  });
  it("removes a key", () => {
    writeJSON("k2", 1); removeKey("k2");
    expect(readJSON("k2", "gone")).toBe("gone");
  });
});
```

- [ ] **Step 6: Run — verify failure, then implement `src/lib/storage.ts`**

Run: `pnpm test src/lib/storage.test.ts` → FAIL. Then:

```ts
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota / private mode */ }
}
export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}
```
Run again → PASS (3 tests).

- [ ] **Step 7: Create `src/lib/site.ts`** (no test — static config)

```ts
import type { Hours } from "@/types";

// Sun..Sat. Café opens daily 7:00; closes 22:00 (Fri/Sat 23:00).
export const HOURS: Hours = [
  { open: "07:00", close: "22:00" }, // Sun
  { open: "07:00", close: "22:00" }, // Mon
  { open: "07:00", close: "22:00" }, // Tue
  { open: "07:00", close: "22:00" }, // Wed
  { open: "07:00", close: "22:00" }, // Thu
  { open: "07:00", close: "23:00" }, // Fri
  { open: "08:00", close: "23:00" }, // Sat
];

export const SITE = {
  name: "Café Dolitó",
  tagline: "Slow-roasted coffee. Italy & India, one table.",
  description:
    "Specialty coffee café and kitchen — authentic Italian, Indian, and Italian-in-Indian-style fusion.",
  url: "https://cafedolito.example",
  email: "hello@cafedolito.example",
  phone: "+1 (503) 555-0142",
  address: { line1: "27 Almond Row", city: "Portland", state: "OR", zip: "97204" },
  currency: "USD",
  hours: HOURS,
  socials: {
    instagram: "https://instagram.com/cafedolito",
    facebook: "https://facebook.com/cafedolito",
    tiktok: "https://tiktok.com/@cafedolito",
  },
} as const;

export const MAIN_NAV = [
  { label: "Menu", href: "/menu" },
  { label: "The Fusion Table", href: "/collections/the-fusion-table" },
  { label: "Reserve", href: "/reserve" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Visit", href: "/visit" },
] as const;

export const FOOTER_LINKS = {
  Explore: [
    { label: "Menu", href: "/menu" },
    { label: "Collections", href: "/collections" },
    { label: "Reserve a table", href: "/reserve" },
    { label: "Private events", href: "/events" },
  ],
  Company: [
    { label: "Our story", href: "/about" },
    { label: "Visit us", href: "/visit" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy", href: "/policies/privacy" },
    { label: "Terms", href: "/policies/terms" },
    { label: "Allergens & dietary", href: "/policies/allergens" },
  ],
} as const;
```

- [ ] **Step 8: Write `src/lib/hours.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { isOpenNow, generateSlots } from "./hours";
import type { Hours } from "@/types";

const HOURS: Hours = Array.from({ length: 7 }, () => ({ open: "07:00", close: "22:00" }));

describe("hours.isOpenNow", () => {
  it("open during hours", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T15:00:00"))).toBe(true); });
  it("closed before open", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T06:30:00"))).toBe(false); });
  it("closed after close", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T22:30:00"))).toBe(false); });
  it("closed when day is null", () => {
    const h: Hours = HOURS.map((d, i) => (i === 1 ? null : d));
    expect(isOpenNow(h, new Date("2026-06-22T12:00:00"))).toBe(false); // Mon
  });
});

describe("hours.generateSlots", () => {
  it("generates 30-min slots within hours", () => {
    const slots = generateSlots(HOURS, new Date("2026-06-23T00:00:00"), 30);
    expect(slots[0]).toBe("07:00");
    expect(slots).toContain("12:30");
    expect(slots.at(-1)).toBe("21:30"); // last seating before 22:00 close
  });
  it("returns [] for a closed day", () => {
    const h: Hours = HOURS.map(() => null);
    expect(generateSlots(h, new Date("2026-06-23T00:00:00"), 30)).toEqual([]);
  });
});
```

- [ ] **Step 9: Run — verify failure, then implement `src/lib/hours.ts`**

Run: `pnpm test src/lib/hours.test.ts` → FAIL. Then:

```ts
import type { Hours } from "@/types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(hours: Hours, now: Date): boolean {
  const day = hours[now.getDay()];
  if (!day) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= toMinutes(day.open) && mins < toMinutes(day.close);
}

/** Bookable start times for `date`, last slot one step before close. */
export function generateSlots(hours: Hours, date: Date, stepMins = 30): string[] {
  const day = hours[date.getDay()];
  if (!day) return [];
  const start = toMinutes(day.open);
  const end = toMinutes(day.close);
  const slots: string[] = [];
  for (let t = start; t <= end - stepMins; t += stepMins) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}
```
Run again → PASS (6 tests).

- [ ] **Step 10: Write `src/lib/pricing.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  TAX_RATE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD,
  calcSubtotal, calcDelivery, resolveDiscount, calcTotals,
} from "./pricing";
import type { CartItem } from "@/types";

function line(over: Partial<CartItem> = {}): CartItem {
  return {
    key: "k", itemId: "i", slug: "s", name: "Latte", image: "x", cuisine: "cafe",
    unitPrice: 5, selections: [], quantity: 2, maxQty: 9, ...over,
  };
}

describe("pricing", () => {
  it("sums subtotal from unitPrice * qty", () => {
    expect(calcSubtotal([line({ unitPrice: 5, quantity: 2 }), line({ unitPrice: 3, quantity: 1 })])).toBe(13);
  });
  it("waives delivery for pickup", () => { expect(calcDelivery(10, "pickup")).toBe(0); });
  it("charges delivery under threshold", () => { expect(calcDelivery(10, "delivery")).toBe(DELIVERY_FEE); });
  it("free delivery at/over threshold", () => { expect(calcDelivery(FREE_DELIVERY_THRESHOLD, "delivery")).toBe(0); });
  it("resolves a known promo", () => { expect(resolveDiscount(100, "BREW10")).toBeCloseTo(10); });
  it("ignores unknown promo", () => { expect(resolveDiscount(100, "NOPE")).toBe(0); });
  it("computes total = subtotal + tax + delivery + tip - discount", () => {
    const t = calcTotals({ items: [line({ unitPrice: 50, quantity: 1 })], fulfillment: "pickup", tip: 5, promoCode: "BREW10" });
    expect(t.subtotal).toBe(50);
    expect(t.discount).toBeCloseTo(5);
    expect(t.tax).toBeCloseTo(50 * TAX_RATE);
    expect(t.total).toBeCloseTo(50 + 50 * TAX_RATE + 0 + 5 - 5);
  });
});
```

- [ ] **Step 11: Run — verify failure, then implement `src/lib/pricing.ts`**

Run: `pnpm test src/lib/pricing.test.ts` → FAIL. Then:

```ts
import type { CartItem, Fulfillment, OrderTotals } from "@/types";

export const TAX_RATE = 0.0875;
export const DELIVERY_FEE = 4.99;
export const FREE_DELIVERY_THRESHOLD = 40;
export const TIP_PRESETS = [0.1, 0.15, 0.2] as const;

/** Flat percentage-off promo codes. */
export const PROMO_CODES: Record<string, number> = {
  BREW10: 0.1,
  MORNING15: 0.15,
  BEANS20: 0.2,
  DOLITO25: 0.25,
};

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function calcDelivery(subtotal: number, fulfillment: Fulfillment): number {
  if (fulfillment === "pickup") return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function resolveDiscount(subtotal: number, code?: string): number {
  if (!code) return 0;
  const pct = PROMO_CODES[code.toUpperCase()];
  return pct ? subtotal * pct : 0;
}

export function calcTotals(args: {
  items: CartItem[]; fulfillment: Fulfillment; tip?: number; promoCode?: string;
}): OrderTotals {
  const subtotal = calcSubtotal(args.items);
  const discount = resolveDiscount(subtotal, args.promoCode);
  const deliveryFee = calcDelivery(subtotal, args.fulfillment);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const tip = args.tip ?? 0;
  const total = +(subtotal - discount + deliveryFee + tax + tip).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), tax, deliveryFee, tip, discount: +discount.toFixed(2), total };
}
```
Run again → PASS (7 tests).

- [ ] **Step 12: Write `src/lib/menu-query.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { filterItems, sortItems, paginate, DEFAULT_PAGE_SIZE } from "./menu-query";
import type { MenuItem } from "@/types";

function item(over: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "1", slug: "s", name: "Item", description: "", type: "food", cuisine: "italian",
    categorySlug: "pasta", collectionSlugs: [], price: 10, images: [], options: [],
    dietary: [], ...over,
  };
}

describe("menu-query", () => {
  const items = [
    item({ id: "1", cuisine: "italian", price: 10, rating: 4.2, dietary: ["veg"] }),
    item({ id: "2", cuisine: "indian", price: 6, rating: 4.9, dietary: ["spicy"], spice: 3 }),
    item({ id: "3", cuisine: "fusion", price: 14, rating: 4.5, dietary: ["new"] }),
  ];
  it("filters by cuisine", () => { expect(filterItems(items, { cuisine: ["indian"] }).map((i) => i.id)).toEqual(["2"]); });
  it("filters by dietary", () => { expect(filterItems(items, { dietary: ["veg"] }).map((i) => i.id)).toEqual(["1"]); });
  it("filters by spiceMax", () => { expect(filterItems(items, { spiceMax: 1 }).every((i) => (i.spice ?? 0) <= 1)).toBe(true); });
  it("searches by query text", () => {
    expect(filterItems([item({ name: "Masala Arrabbiata" })], { q: "masala" })).toHaveLength(1);
  });
  it("sorts price ascending", () => { expect(sortItems(items, "price-asc").map((i) => i.id)).toEqual(["2", "1", "3"]); });
  it("sorts rating", () => { expect(sortItems(items, "rating")[0].id).toBe("2"); });
  it("paginates", () => {
    const page = paginate(items, 1, 2);
    expect(page.items).toHaveLength(2);
    expect(page.total).toBe(3);
  });
  it("has a default page size", () => { expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0); });
});
```

- [ ] **Step 13: Run — verify failure, then implement `src/lib/menu-query.ts`**

Run: `pnpm test src/lib/menu-query.test.ts` → FAIL. Then:

```ts
import type { MenuItem, Paginated, ProductQuery, SortKey } from "@/types";

export const DEFAULT_PAGE_SIZE = 12;

export function filterItems(items: MenuItem[], q: ProductQuery): MenuItem[] {
  return items.filter((i) => {
    if (q.cuisine?.length && !q.cuisine.includes(i.cuisine)) return false;
    if (q.category && i.categorySlug !== q.category) return false;
    if (q.dietary?.length && !q.dietary.every((d) => i.dietary.includes(d))) return false;
    if (q.spiceMax != null && (i.spice ?? 0) > q.spiceMax) return false;
    if (q.q) {
      const hay = `${i.name} ${i.description}`.toLowerCase();
      if (!hay.includes(q.q.toLowerCase())) return false;
    }
    return true;
  });
}

const COMPARATORS: Record<SortKey, (a: MenuItem, b: MenuItem) => number> = {
  popular: (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
  newest: (a, b) => Number(b.dietary.includes("new")) - Number(a.dietary.includes("new")),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
};

export function sortItems(items: MenuItem[], sort: SortKey = "popular"): MenuItem[] {
  return [...items].sort(COMPARATORS[sort]);
}

export function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Paginated<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}
```
Run again → PASS (8 tests).

- [ ] **Step 14: Write `src/lib/catalog-params.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { parseProductQuery, toggleCsv, hasActiveFilters } from "./catalog-params";

describe("catalog-params", () => {
  it("parses cuisine + dietary CSV and sort", () => {
    const sp = new URLSearchParams("cuisine=indian,fusion&dietary=veg&sort=rating&q=chai&page=2");
    const q = parseProductQuery(sp);
    expect(q.cuisine).toEqual(["indian", "fusion"]);
    expect(q.dietary).toEqual(["veg"]);
    expect(q.sort).toBe("rating");
    expect(q.q).toBe("chai");
    expect(q.page).toBe(2);
  });
  it("toggles a CSV value", () => {
    expect(toggleCsv("a,b", "b")).toBe("a");
    expect(toggleCsv("a", "b")).toBe("a,b");
  });
  it("detects active filters", () => {
    expect(hasActiveFilters({ cuisine: ["indian"] })).toBe(true);
    expect(hasActiveFilters({})).toBe(false);
  });
});
```

- [ ] **Step 15: Run — verify failure, then implement `src/lib/catalog-params.ts`**

Run: `pnpm test src/lib/catalog-params.test.ts` → FAIL. Then:

```ts
import type { Cuisine, DietaryTag, ProductQuery, SortKey } from "@/types";

const SORTS: SortKey[] = ["popular", "newest", "price-asc", "price-desc", "rating"];

export function parseProductQuery(sp: URLSearchParams): ProductQuery {
  const csv = (k: string) => (sp.get(k)?.split(",").map((s) => s.trim()).filter(Boolean) ?? []);
  const q: ProductQuery = {};
  const cuisine = csv("cuisine") as Cuisine[];
  const dietary = csv("dietary") as DietaryTag[];
  if (cuisine.length) q.cuisine = cuisine;
  if (dietary.length) q.dietary = dietary;
  if (sp.get("category")) q.category = sp.get("category")!;
  const sort = sp.get("sort") as SortKey | null;
  if (sort && SORTS.includes(sort)) q.sort = sort;
  if (sp.get("spiceMax")) q.spiceMax = Number(sp.get("spiceMax")) as ProductQuery["spiceMax"];
  if (sp.get("q")) q.q = sp.get("q")!;
  if (sp.get("page")) q.page = Math.max(1, Number(sp.get("page")) || 1);
  return q;
}

export function toggleCsv(csv: string | undefined, value: string): string {
  const set = new Set((csv ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  set.has(value) ? set.delete(value) : set.add(value);
  return [...set].join(",");
}

export function hasActiveFilters(q: ProductQuery): boolean {
  return Boolean(q.cuisine?.length || q.dietary?.length || q.category || q.spiceMax != null || q.q);
}
```
Run again → PASS (3 tests).

- [ ] **Step 16: Write `src/lib/facets.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildFacets } from "./facets";
import type { MenuItem } from "@/types";

function item(over: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "1", slug: "s", name: "x", description: "", type: "food", cuisine: "italian",
    categorySlug: "pasta", collectionSlugs: [], price: 10, images: [], options: [], dietary: [], ...over,
  };
}

describe("buildFacets", () => {
  const f = buildFacets([
    item({ cuisine: "italian", categorySlug: "pasta", price: 10, dietary: ["veg"] }),
    item({ cuisine: "indian", categorySlug: "curries", price: 18, dietary: ["spicy", "veg"] }),
  ]);
  it("collects unique cuisines", () => { expect(f.cuisines.sort()).toEqual(["indian", "italian"]); });
  it("collects unique categories", () => { expect(f.categories.sort()).toEqual(["curries", "pasta"]); });
  it("collects unique dietary tags", () => { expect(f.dietary.sort()).toEqual(["spicy", "veg"]); });
  it("computes price range", () => { expect(f.priceRange).toEqual({ min: 10, max: 18 }); });
});
```

- [ ] **Step 17: Run — verify failure, then implement `src/lib/facets.ts`**

Run: `pnpm test src/lib/facets.test.ts` → FAIL. Then:

```ts
import type { Cuisine, DietaryTag, MenuItem } from "@/types";

export interface Facets {
  cuisines: Cuisine[];
  categories: string[];
  dietary: DietaryTag[];
  priceRange: { min: number; max: number };
}

export function buildFacets(items: MenuItem[]): Facets {
  const cuisines = new Set<Cuisine>();
  const categories = new Set<string>();
  const dietary = new Set<DietaryTag>();
  let min = Infinity, max = -Infinity;
  for (const i of items) {
    cuisines.add(i.cuisine);
    categories.add(i.categorySlug);
    i.dietary.forEach((d) => dietary.add(d));
    min = Math.min(min, i.price);
    max = Math.max(max, i.price);
  }
  return {
    cuisines: [...cuisines],
    categories: [...categories],
    dietary: [...dietary],
    priceRange: { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 },
  };
}
```
Run again → PASS (4 tests).

- [ ] **Step 18: Create `src/lib/navigation.ts`** (small helper, no test)

```ts
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

- [ ] **Step 19: Create zod schemas** `src/lib/validation/{auth,checkout,reservation}.ts`

`auth.ts`:
```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
export type RegisterForm = z.infer<typeof registerSchema>;
```

`checkout.ts`:
```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP"),
});

export const paymentSchema = z.object({
  cardName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, "Enter a 16-digit card"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "3–4 digits"),
});
export type ContactForm = z.infer<typeof contactSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
```

`reservation.ts`:
```ts
import { z } from "zod";

export const reservationSchema = z.object({
  date: z.string().min(1, "Pick a date"),
  timeSlot: z.string().min(1, "Pick a time"),
  partySize: z.coerce.number().int().min(1, "At least 1 guest").max(20, "Call us for parties over 20"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  occasion: z.string().optional(),
  notes: z.string().max(500, "Keep notes under 500 characters").optional(),
});
export type ReservationForm = z.infer<typeof reservationSchema>;
```

- [ ] **Step 20: Run the full lib suite**

Run: `pnpm test src/lib`
Expected: all PASS (format, storage, hours, pricing, menu-query, catalog-params, facets).

- [ ] **Step 21: Typecheck & commit**

Run: `pnpm typecheck` → passes.
```bash
git add -A
git commit -m "feat: add tested lib layer (format, storage, hours, pricing, query, facets, validation, site)"
```

---

## Task 6: Mock datasets

**Files:**
- Create: `src/mocks/factory.ts`, `src/mocks/images.ts`, `src/mocks/categories.ts`, `src/mocks/collections.ts`, `src/mocks/reviews.ts`, `src/mocks/users.ts`, `src/mocks/items/{cafe,italian,indian,fusion,beans,index}.ts`
- Test: `src/mocks/items/index.test.ts`

**Interfaces:**
- Consumes: `@/types`.
- Produces: `makeItem(partial): MenuItem`; `ITEMS: MenuItem[]`, `getItem(slug)`; `CATEGORIES: Category[]`; `COLLECTIONS: Collection[]`; `REVIEWS: Review[]`; `SEED_USERS: MockUser[]`, `DEMO_CREDENTIALS`; `IMG` (Unsplash URL map) + `unsplash(id, w)` helper.

- [ ] **Step 1: Create `src/mocks/images.ts`** (centralized Unsplash URLs + helper)

```ts
/** Build a sized Unsplash URL from a photo id. */
export function unsplash(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
}

// Curated coffee/Italian/Indian photo ids (swap freely — single source of truth).
export const IMG = {
  heroBackplate: "photo-1453614512568-c4024d13c247",
  heroJar: "photo-1610889556528-9a770e32642f",
  beans: "photo-1559056199-641a0ac8b55e",
  espresso: "photo-1510707577719-ae7c14805e3a",
  latte: "photo-1541167760496-1628856ab772",
  coldBrew: "photo-1461023058943-07fcbe16d735",
  pasta: "photo-1473093295043-cdd812d0e601",
  pizza: "photo-1513104890138-7c749659a591",
  risotto: "photo-1476124369491-e7addf5db371",
  tiramisu: "photo-1571877227200-a0d98ea607e9",
  curry: "photo-1631452180519-c014fe946bc7",
  biryani: "photo-1563379091339-03b21ab4a4f8",
  tandoor: "photo-1599487488170-d11ec9c172f0",
  chaat: "photo-1606491956689-2ea866880c84",
  naan: "photo-1601050690597-df0568f70950",
  fusion: "photo-1565299624946-b28f40a0ae38",
  interior: "photo-1554118811-1e0d58224f24",
  gallery1: "photo-1442512595331-e89e73853f31",
  gallery2: "photo-1521017432531-fbd92d768814",
} as const;

/** Inline SVG fallback (used if a remote image fails). */
export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'><rect width='100%' height='100%' fill='%23e7d2b6'/></svg>`,
  );
```

- [ ] **Step 2: Create `src/mocks/factory.ts`**

```ts
import type { ItemOption, MenuItem } from "@/types";
import { unsplash } from "./images";

let seq = 0;

/** Common option sets reused across items. */
export const OPTIONS = {
  drinkSize: {
    id: "size", name: "Size", type: "single", required: true,
    values: [
      { id: "s", label: "Small", priceDelta: 0 },
      { id: "m", label: "Medium", priceDelta: 0.75 },
      { id: "l", label: "Large", priceDelta: 1.5 },
    ],
  } satisfies ItemOption,
  milk: {
    id: "milk", name: "Milk", type: "single",
    values: [
      { id: "whole", label: "Whole", priceDelta: 0 },
      { id: "oat", label: "Oat", priceDelta: 0.6 },
      { id: "almond", label: "Almond", priceDelta: 0.6 },
    ],
  } satisfies ItemOption,
  spiceChoice: {
    id: "spice", name: "Spice", type: "single",
    values: [
      { id: "mild", label: "Mild", priceDelta: 0 },
      { id: "medium", label: "Medium", priceDelta: 0 },
      { id: "hot", label: "Hot", priceDelta: 0 },
    ],
  } satisfies ItemOption,
  grind: {
    id: "grind", name: "Grind", type: "single", required: true,
    values: [
      { id: "whole", label: "Whole bean", priceDelta: 0 },
      { id: "espresso", label: "Espresso", priceDelta: 0 },
      { id: "filter", label: "Filter", priceDelta: 0 },
    ],
  } satisfies ItemOption,
  weight: {
    id: "weight", name: "Weight", type: "single", required: true,
    values: [
      { id: "250", label: "250g", priceDelta: 0 },
      { id: "500", label: "500g", priceDelta: 7 },
      { id: "1000", label: "1kg", priceDelta: 13 },
    ],
  } satisfies ItemOption,
} as const;

export function makeItem(p: Partial<MenuItem> & Pick<MenuItem, "name" | "cuisine" | "categorySlug" | "price">): MenuItem {
  seq += 1;
  const slug = p.slug ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const imageId = p.images?.[0]?.src ?? unsplash("photo-1495474472287-4d71bcdd2085");
  return {
    id: p.id ?? `cd-${seq}`,
    slug,
    name: p.name,
    description: p.description ?? "",
    type: p.type ?? "food",
    cuisine: p.cuisine,
    categorySlug: p.categorySlug,
    collectionSlugs: p.collectionSlugs ?? [],
    price: p.price,
    images: p.images ?? [{ src: imageId, alt: p.name }],
    options: p.options ?? [],
    dietary: p.dietary ?? [],
    spice: p.spice,
    veg: p.veg,
    rating: p.rating ?? 4.6,
    reviewCount: p.reviewCount ?? 24,
    prepTimeMins: p.prepTimeMins,
    calories: p.calories,
    available: p.available ?? true,
  };
}
```

- [ ] **Step 3: Create the per-cuisine item files** — `src/mocks/items/cafe.ts`, `italian.ts`, `indian.ts`, `fusion.ts`, `beans.ts`

Author each as `export const <CUISINE>_ITEMS: MenuItem[] = [...]` using `makeItem` + `OPTIONS` + `unsplash(IMG.*)`. Follow this exact pattern (shown for café & fusion); populate **each file with 6–10 items** so totals land ~40–55.

`cafe.ts` (example — extend to ~8):
```ts
import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const CAFE_ITEMS: MenuItem[] = [
  makeItem({
    name: "Doppio Espresso", cuisine: "cafe", type: "drink", categorySlug: "espresso", price: 3.5,
    description: "Two ristretto shots of our small-batch house roast.",
    images: [{ src: unsplash(IMG.espresso), alt: "Espresso in a cup" }],
    options: [OPTIONS.drinkSize], dietary: ["vegan", "bestseller"], collectionSlugs: ["roasters-picks"],
  }),
  makeItem({
    name: "Cardamom Rose Latte", cuisine: "cafe", type: "drink", categorySlug: "signature-lattes", price: 5.5,
    description: "Espresso, steamed milk, green cardamom and a whisper of rose.",
    images: [{ src: unsplash(IMG.latte), alt: "Latte with art" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["veg", "chefs-special"], collectionSlugs: ["seasonal"],
  }),
  // … add cold brew, cortado, masala-chai, hot chocolate, matcha, affogato
];
```

`fusion.ts` (the headline — extend to ~9):
```ts
import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const FUSION_ITEMS: MenuItem[] = [
  makeItem({
    name: "Tandoori Chicken Pizza", cuisine: "fusion", categorySlug: "fusion-signatures", price: 17,
    description: "Wood-fired Napoletana base, tandoori chicken, red onion, mint-yogurt drizzle.",
    images: [{ src: unsplash(IMG.fusion), alt: "Fusion pizza" }],
    options: [OPTIONS.spiceChoice], dietary: ["spicy", "chefs-special", "bestseller"], spice: 2,
    collectionSlugs: ["the-fusion-table"],
  }),
  makeItem({
    name: "Butter-Chicken Risotto", cuisine: "fusion", categorySlug: "fusion-signatures", price: 19,
    description: "Carnaroli rice slow-stirred in a makhani cream, charred chicken, kasuri methi.",
    images: [{ src: unsplash(IMG.risotto), alt: "Risotto" }],
    options: [OPTIONS.spiceChoice], dietary: ["chefs-special"], spice: 2, collectionSlugs: ["the-fusion-table"],
  }),
  makeItem({
    name: "Gulab Jamun Tiramisù", cuisine: "fusion", type: "food", categorySlug: "fusion-signatures", price: 9,
    description: "Mascarpone, espresso-soaked savoiardi, cardamom gulab jamun.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Tiramisu" }],
    dietary: ["veg", "new"], collectionSlugs: ["the-fusion-table"],
  }),
  // … add Masala Arrabbiata, Paneer Lasagna, Tikka Pesto Penne, Keema Bolognese, Masala Chai Affogato, Chai Panna Cotta
];
```

Author `italian.ts` (antipasti/pasta/pizza/risotto/dolci), `indian.ts` (chaat-street/curries/tandoor/biryani/breads/mithai — set `veg` + `spice` appropriately, add `halal` where apt), and `beans.ts` (`type: "bean"`, `categorySlug: "beans"`, `options: [OPTIONS.weight, OPTIONS.grind]`, `collectionSlugs: ["roasters-picks"]`) the same way.

- [ ] **Step 4: Create `src/mocks/items/index.ts`** (aggregate + lookup)

```ts
import type { MenuItem } from "@/types";
import { CAFE_ITEMS } from "./cafe";
import { ITALIAN_ITEMS } from "./italian";
import { INDIAN_ITEMS } from "./indian";
import { FUSION_ITEMS } from "./fusion";
import { BEAN_ITEMS } from "./beans";

export const ITEMS: MenuItem[] = [
  ...CAFE_ITEMS, ...ITALIAN_ITEMS, ...INDIAN_ITEMS, ...FUSION_ITEMS, ...BEAN_ITEMS,
];

export function getItem(slug: string): MenuItem | undefined {
  return ITEMS.find((i) => i.slug === slug);
}
```

- [ ] **Step 5: Create `src/mocks/categories.ts`**

```ts
import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { slug: "espresso", name: "Espresso", cuisine: "cafe" },
  { slug: "signature-lattes", name: "Signature Lattes", cuisine: "cafe" },
  { slug: "cold-brew", name: "Cold Brew & Iced", cuisine: "cafe" },
  { slug: "tea-not-coffee", name: "Tea & Not-Coffee", cuisine: "cafe" },
  { slug: "antipasti", name: "Antipasti", cuisine: "italian" },
  { slug: "pasta", name: "Pasta", cuisine: "italian" },
  { slug: "pizza", name: "Pizza", cuisine: "italian" },
  { slug: "risotto", name: "Risotto", cuisine: "italian" },
  { slug: "dolci", name: "Dolci", cuisine: "italian" },
  { slug: "chaat-street", name: "Chaat & Street", cuisine: "indian" },
  { slug: "curries", name: "Curries", cuisine: "indian" },
  { slug: "tandoor", name: "Tandoor", cuisine: "indian" },
  { slug: "biryani", name: "Biryani", cuisine: "indian" },
  { slug: "breads", name: "Breads", cuisine: "indian" },
  { slug: "mithai", name: "Mithai", cuisine: "indian" },
  { slug: "fusion-signatures", name: "Fusion Signatures", cuisine: "fusion" },
  { slug: "beans", name: "Retail Beans", cuisine: "cafe" },
];
```

- [ ] **Step 6: Create `src/mocks/collections.ts`**

```ts
import type { Collection } from "@/types";
import { unsplash, IMG } from "./images";

export const COLLECTIONS: Collection[] = [
  { slug: "the-fusion-table", name: "The Fusion Table", tagline: "Italian, cooked in Indian style.", image: unsplash(IMG.fusion), itemIds: [] },
  { slug: "italian-classics", name: "Italian Classics", tagline: "From Napoli, with love.", image: unsplash(IMG.pasta), itemIds: [] },
  { slug: "indian-soul", name: "Indian Soul", tagline: "Spice, smoke and comfort.", image: unsplash(IMG.curry), itemIds: [] },
  { slug: "roasters-picks", name: "Roaster's Picks", tagline: "Beans for home.", image: unsplash(IMG.beans), itemIds: [] },
  { slug: "seasonal", name: "Seasonal", tagline: "Right now, only.", image: unsplash(IMG.latte), itemIds: [] },
];
```
> `itemIds` are resolved at read time by `collection.service` from `ITEMS` (via `collectionSlugs`), so they can stay empty here.

- [ ] **Step 7: Create `src/mocks/reviews.ts` and `src/mocks/users.ts`**

`reviews.ts`:
```ts
import type { Review } from "@/types";

export const REVIEWS: Review[] = [
  { id: "r1", author: "Priya N.", rating: 5, body: "The butter-chicken risotto is unreal. Two worlds, one bowl.", date: "2026-05-02T00:00:00.000Z" },
  { id: "r2", author: "Marco R.", rating: 5, body: "Proper espresso and a tandoori pizza that actually works.", date: "2026-04-18T00:00:00.000Z" },
  { id: "r3", author: "Aisha K.", rating: 4, body: "Cosy, warm, smells incredible. Gulab jamun tiramisù = genius.", date: "2026-03-30T00:00:00.000Z" },
];
```

`users.ts`:
```ts
import type { MockUser } from "@/types";

export const DEMO_CREDENTIALS = { email: "demo@cafedolito.com", password: "password123" } as const;

export const SEED_USERS: MockUser[] = [
  { id: "u1", firstName: "Demo", lastName: "Guest", email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password },
];
```

- [ ] **Step 8: Write `src/mocks/items/index.test.ts`** (dataset integrity)

```ts
import { describe, expect, it } from "vitest";
import { ITEMS, getItem } from "./index";
import { CATEGORIES } from "../categories";

describe("mock items", () => {
  it("has a healthy catalog size", () => { expect(ITEMS.length).toBeGreaterThanOrEqual(35); });
  it("has unique slugs", () => { expect(new Set(ITEMS.map((i) => i.slug)).size).toBe(ITEMS.length); });
  it("references only known categories", () => {
    const known = new Set(CATEGORIES.map((c) => c.slug));
    expect(ITEMS.every((i) => known.has(i.categorySlug))).toBe(true);
  });
  it("covers all four cuisines", () => {
    expect(new Set(ITEMS.map((i) => i.cuisine))).toEqual(new Set(["cafe", "italian", "indian", "fusion"]));
  });
  it("looks items up by slug", () => { expect(getItem(ITEMS[0].slug)?.id).toBe(ITEMS[0].id); });
});
```

- [ ] **Step 9: Run dataset test + typecheck**

Run: `pnpm test src/mocks` then `pnpm typecheck`
Expected: all PASS; types clean. (If the size test fails, add more items per cuisine file.)

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add mock datasets (items, categories, collections, reviews, users, images)"
```

---

## Task 7: Mock services (TDD)

**Files:**
- Create: `src/services/{delay,menu,category,collection,order,reservation,auth,review}.ts`
- Test: `src/services/{menu,order,reservation,auth}.service.test.ts`

**Interfaces:**
- Consumes: `@/mocks/*`, `@/lib/{menu-query,pricing,hours,storage,site}`, `@/types`.
- Produces:
  - `withDelay<T>(value: T, ms?): Promise<T>`
  - `menuService.list(query): Promise<Paginated<MenuItem>>`, `.getBySlug(slug)`, `.facets()`, `.byCategory(slug)`
  - `categoryService.list()`, `.get(slug)`
  - `collectionService.list()`, `.get(slug)` (resolves items)
  - `orderService.create(input): Promise<Order>`, `.list(): Promise<Order[]>`, `.get(id)`
  - `reservationService.slots(date): Promise<string[]>`, `.create(input): Promise<Reservation>`, `.list()`, `.cancel(id)`
  - `authService.login(email,pw): Promise<SessionUser>`, `.register(input)`, `class AuthError`
  - `reviewService.list(itemSlug?)`

- [ ] **Step 1: Create `src/services/delay.ts`**

```ts
export function withDelay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
```

- [ ] **Step 2: Write `src/services/menu.service.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { menuService } from "./menu";

describe("menuService", () => {
  it("lists paginated items", async () => {
    const page = await menuService.list({ page: 1 });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.total).toBeGreaterThanOrEqual(page.items.length);
  });
  it("filters by cuisine", async () => {
    const page = await menuService.list({ cuisine: ["fusion"] });
    expect(page.items.every((i) => i.cuisine === "fusion")).toBe(true);
  });
  it("gets an item by slug", async () => {
    const first = (await menuService.list({})).items[0];
    expect((await menuService.getBySlug(first.slug))?.id).toBe(first.id);
  });
});
```

- [ ] **Step 3: Run — verify failure, then implement `src/services/menu.ts`**

Run: `pnpm test src/services/menu.service.test.ts` → FAIL. Then:

```ts
import type { MenuItem, Paginated, ProductQuery } from "@/types";
import { ITEMS, getItem } from "@/mocks/items";
import { filterItems, sortItems, paginate, DEFAULT_PAGE_SIZE } from "@/lib/menu-query";
import { buildFacets } from "@/lib/facets";
import { withDelay } from "./delay";

export const menuService = {
  async list(query: ProductQuery): Promise<Paginated<MenuItem>> {
    const filtered = sortItems(filterItems(ITEMS, query), query.sort);
    return withDelay(paginate(filtered, query.page ?? 1, DEFAULT_PAGE_SIZE));
  },
  async getBySlug(slug: string): Promise<MenuItem | undefined> {
    return withDelay(getItem(slug));
  },
  async byCategory(slug: string): Promise<MenuItem[]> {
    return withDelay(ITEMS.filter((i) => i.categorySlug === slug));
  },
  async facets() {
    return withDelay(buildFacets(ITEMS));
  },
};
```
Run again → PASS.

- [ ] **Step 4: Create `src/services/category.ts`, `collection.ts`, `review.ts`** (no separate tests — thin)

`category.ts`:
```ts
import type { Category } from "@/types";
import { CATEGORIES } from "@/mocks/categories";
import { withDelay } from "./delay";

export const categoryService = {
  list: () => withDelay(CATEGORIES),
  get: (slug: string): Promise<Category | undefined> => withDelay(CATEGORIES.find((c) => c.slug === slug)),
};
```

`collection.ts`:
```ts
import type { Collection, MenuItem } from "@/types";
import { COLLECTIONS } from "@/mocks/collections";
import { ITEMS } from "@/mocks/items";
import { withDelay } from "./delay";

function resolve(c: Collection): Collection & { items: MenuItem[] } {
  return { ...c, items: ITEMS.filter((i) => i.collectionSlugs.includes(c.slug)) };
}

export const collectionService = {
  list: () => withDelay(COLLECTIONS.map(resolve)),
  get: (slug: string) => withDelay(COLLECTIONS.filter((c) => c.slug === slug).map(resolve)[0]),
};
```

`review.ts`:
```ts
import { REVIEWS } from "@/mocks/reviews";
import { withDelay } from "./delay";

export const reviewService = {
  list: (itemSlug?: string) =>
    withDelay(itemSlug ? REVIEWS.filter((r) => r.itemSlug === itemSlug) : REVIEWS),
};
```

- [ ] **Step 5: Write `src/services/order.service.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { orderService } from "./order";
import type { CartItem } from "@/types";

const item: CartItem = {
  key: "k", itemId: "i", slug: "doppio", name: "Doppio", image: "x", cuisine: "cafe",
  unitPrice: 3.5, selections: [], quantity: 2, maxQty: 9,
};

describe("orderService", () => {
  beforeEach(() => localStorage.clear());
  it("creates an order with totals, a code and pickup status", async () => {
    const order = await orderService.create({
      items: [item], fulfillment: "pickup", slot: "08:00",
      contact: { name: "Demo", email: "d@e.com", phone: "5550142" },
    });
    expect(order.code).toMatch(/^CD-/);
    expect(order.totals.subtotal).toBe(7);
    expect(order.status).toBe("received");
  });
  it("persists and lists created orders", async () => {
    await orderService.create({ items: [item], fulfillment: "pickup", contact: { name: "D", email: "d@e.com", phone: "1" } });
    expect((await orderService.list()).length).toBe(1);
  });
});
```

- [ ] **Step 6: Run — verify failure, then implement `src/services/order.ts`**

Run: `pnpm test src/services/order.service.test.ts` → FAIL. Then:

```ts
import type { Address, CartItem, Contact, Fulfillment, Order } from "@/types";
import { calcTotals } from "@/lib/pricing";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:orders";
let counter = 1000;

interface CreateOrderInput {
  items: CartItem[]; fulfillment: Fulfillment; slot?: string;
  address?: Address; contact: Contact; tip?: number; promoCode?: string;
}

export const orderService = {
  async create(input: CreateOrderInput): Promise<Order> {
    counter += 1;
    const order: Order = {
      id: `o-${counter}`,
      code: `CD-${counter}`,
      items: input.items,
      fulfillment: input.fulfillment,
      slot: input.slot,
      address: input.address,
      contact: input.contact,
      totals: calcTotals({ items: input.items, fulfillment: input.fulfillment, tip: input.tip, promoCode: input.promoCode }),
      promoCode: input.promoCode,
      status: "received",
      placedAt: new Date().toISOString(),
    };
    const all = readJSON<Order[]>(KEY, []);
    writeJSON(KEY, [order, ...all]);
    return withDelay(order, 300);
  },
  async list(): Promise<Order[]> { return withDelay(readJSON<Order[]>(KEY, [])); },
  async get(id: string): Promise<Order | undefined> {
    return withDelay(readJSON<Order[]>(KEY, []).find((o) => o.id === id));
  },
};
```
> `new Date().toISOString()` runs in the browser/service at call time — fine here (not in a Workflow script).
Run again → PASS.

- [ ] **Step 7: Write `src/services/reservation.service.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { reservationService } from "./reservation";

describe("reservationService", () => {
  beforeEach(() => localStorage.clear());
  it("returns bookable slots for a date", async () => {
    const slots = await reservationService.slots("2026-06-23");
    expect(slots[0]).toMatch(/^\d{2}:\d{2}$/);
    expect(slots.length).toBeGreaterThan(0);
  });
  it("creates a reservation with a reference and confirmed status", async () => {
    const r = await reservationService.create({
      date: "2026-06-23", timeSlot: "19:00", partySize: 2,
      name: "Demo", email: "d@e.com", phone: "5550142",
    });
    expect(r.reference).toMatch(/^CD-R-/);
    expect(r.status).toBe("confirmed");
    expect((await reservationService.list()).length).toBe(1);
  });
  it("cancels a reservation", async () => {
    const r = await reservationService.create({ date: "2026-06-23", timeSlot: "19:00", partySize: 2, name: "D", email: "d@e.com", phone: "1" });
    await reservationService.cancel(r.id);
    expect((await reservationService.list())[0].status).toBe("cancelled");
  });
});
```

- [ ] **Step 8: Run — verify failure, then implement `src/services/reservation.ts`**

Run: `pnpm test src/services/reservation.service.test.ts` → FAIL. Then:

```ts
import type { Reservation } from "@/types";
import { SITE } from "@/lib/site";
import { generateSlots } from "@/lib/hours";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:reservations";
let counter = 500;

interface CreateReservationInput {
  date: string; timeSlot: string; partySize: number;
  name: string; email: string; phone: string; occasion?: string; notes?: string;
}

export const reservationService = {
  async slots(dateIso: string): Promise<string[]> {
    return withDelay(generateSlots(SITE.hours, new Date(`${dateIso}T00:00:00`), 30));
  },
  async create(input: CreateReservationInput): Promise<Reservation> {
    counter += 1;
    const reservation: Reservation = {
      id: `r-${counter}`,
      reference: `CD-R-${counter}`,
      ...input,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    writeJSON(KEY, [reservation, ...readJSON<Reservation[]>(KEY, [])]);
    return withDelay(reservation, 300);
  },
  async list(): Promise<Reservation[]> { return withDelay(readJSON<Reservation[]>(KEY, [])); },
  async cancel(id: string): Promise<void> {
    const all = readJSON<Reservation[]>(KEY, []).map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r));
    writeJSON(KEY, all);
    return withDelay(undefined);
  },
};
```
Run again → PASS.

- [ ] **Step 9: Write `src/services/auth.service.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { authService, AuthError } from "./auth";
import { DEMO_CREDENTIALS } from "@/mocks/users";

describe("authService", () => {
  beforeEach(() => localStorage.clear());
  it("logs in the demo user", async () => {
    const user = await authService.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(user.email).toBe(DEMO_CREDENTIALS.email);
    expect((user as unknown as { password?: string }).password).toBeUndefined();
  });
  it("rejects a bad password", async () => {
    await expect(authService.login(DEMO_CREDENTIALS.email, "wrong")).rejects.toBeInstanceOf(AuthError);
  });
  it("registers a new user", async () => {
    const user = await authService.register({ firstName: "A", lastName: "B", email: "a@b.com", password: "password123" });
    expect(user.email).toBe("a@b.com");
  });
  it("rejects duplicate email on register", async () => {
    await expect(
      authService.register({ firstName: "X", lastName: "Y", email: DEMO_CREDENTIALS.email, password: "password123" }),
    ).rejects.toBeInstanceOf(AuthError);
  });
});
```

- [ ] **Step 10: Run — verify failure, then implement `src/services/auth.ts`**

Run: `pnpm test src/services/auth.service.test.ts` → FAIL. Then:

```ts
import type { MockUser, SessionUser } from "@/types";
import { SEED_USERS } from "@/mocks/users";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:users";

export class AuthError extends Error {}

function allUsers(): MockUser[] {
  const extra = readJSON<MockUser[]>(KEY, []);
  return [...SEED_USERS, ...extra];
}
function toSession(u: MockUser): SessionUser {
  return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email };
}

export const authService = {
  async login(email: string, password: string): Promise<SessionUser> {
    const user = allUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) throw new AuthError("Incorrect email or password.");
    return withDelay(toSession(user), 250);
  },
  async register(input: { firstName: string; lastName: string; email: string; password: string }): Promise<SessionUser> {
    if (allUsers().some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new AuthError("An account with that email already exists.");
    }
    const user: MockUser = { id: `u-${Date.now()}`, ...input };
    writeJSON(KEY, [...readJSON<MockUser[]>(KEY, []), user]);
    return withDelay(toSession(user), 250);
  },
};
```
Run again → PASS.

- [ ] **Step 11: Run full services suite + typecheck + commit**

Run: `pnpm test src/services` → all PASS. `pnpm typecheck` → clean.
```bash
git add -A
git commit -m "feat: add mock service layer (menu, category, collection, order, reservation, auth, review)"
```

---

## Task 8: Zustand stores (TDD)

**Files:**
- Create: `src/store/{ui,cart,favorites,promo,recently-viewed,auth}.store.ts`
- Test: `src/store/{cart,favorites,auth}.store.test.ts`

**Interfaces:**
- Consumes: `@/types`, `@/services/auth`, `@/lib/pricing`.
- Produces:
  - `useUiStore` — `{ cartOpen, searchOpen, mobileNavOpen, setCartOpen, setSearchOpen, setMobileNavOpen }` (not persisted).
  - `useCartStore` — `{ items, addItem(item), setQty(key, n), remove(key), clear() }`; selectors `selectCartItems`, `selectCartCount`. Persist `cd:cart`.
  - `useFavoritesStore` — `{ ids, toggle(id), has(id) }`. Persist `cd:favorites`.
  - `usePromoStore` — `{ code, setCode(code|null) }`. Persist `cd:promo`.
  - `useRecentlyViewedStore` — `{ ids, push(id) }` (cap 8). Persist `cd:recent`.
  - `useAuthStore` — `{ user, status, login(email,pw), register(input), logout() }`. Persist `cd:auth` (partialize user only).

- [ ] **Step 1: Create `src/store/ui.store.ts`** (no test — trivial)

```ts
import { create } from "zustand";

interface UiState {
  cartOpen: boolean; searchOpen: boolean; mobileNavOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false, searchOpen: false, mobileNavOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
}));
```

- [ ] **Step 2: Write `src/store/cart.store.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { useCartStore, selectCartCount } from "./cart.store";
import type { CartItem } from "@/types";

function line(over: Partial<CartItem> = {}): CartItem {
  return {
    key: "doppio|m", itemId: "i", slug: "doppio", name: "Doppio", image: "x", cuisine: "cafe",
    unitPrice: 4.25, selections: [], quantity: 1, maxQty: 9, ...over,
  };
}
const cart = () => useCartStore.getState();

describe("cart.store", () => {
  beforeEach(() => cart().clear());
  it("adds a new line", () => { cart().addItem(line()); expect(cart().items).toHaveLength(1); });
  it("merges quantity for the same key", () => {
    cart().addItem(line({ quantity: 1 }));
    cart().addItem(line({ quantity: 2 }));
    expect(cart().items).toHaveLength(1);
    expect(cart().items[0].quantity).toBe(3);
  });
  it("clamps merged quantity to maxQty", () => {
    cart().addItem(line({ quantity: 7 }));
    cart().addItem(line({ quantity: 7 }));
    expect(cart().items[0].quantity).toBe(9);
  });
  it("sets and removes by key", () => {
    cart().addItem(line());
    cart().setQty("doppio|m", 5); expect(cart().items[0].quantity).toBe(5);
    cart().remove("doppio|m"); expect(cart().items).toHaveLength(0);
  });
  it("selectCartCount sums quantities", () => {
    cart().addItem(line({ key: "a", quantity: 2 }));
    cart().addItem(line({ key: "b", quantity: 3 }));
    expect(selectCartCount(cart())).toBe(5);
  });
});
```

- [ ] **Step 3: Run — verify failure, then implement `src/store/cart.store.ts`**

Run: `pnpm test src/store/cart.store.test.ts` → FAIL. Then:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.key === item.key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === item.key ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQty) } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: Math.min(item.quantity, item.maxQty) }] };
        }),
      setQty: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQty)) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: "cd:cart" },
  ),
);

export const selectCartItems = (s: CartState) => s.items;
export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
```
Run again → PASS (5 tests).

- [ ] **Step 4: Write `src/store/favorites.store.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { useFavoritesStore } from "./favorites.store";

const fav = () => useFavoritesStore.getState();

describe("favorites.store", () => {
  beforeEach(() => useFavoritesStore.setState({ ids: [] }));
  it("toggles an id on and off", () => {
    fav().toggle("x"); expect(fav().has("x")).toBe(true);
    fav().toggle("x"); expect(fav().has("x")).toBe(false);
  });
});
```

- [ ] **Step 5: Run — verify failure, then implement `src/store/favorites.store.ts`**

Run: `pnpm test src/store/favorites.store.test.ts` → FAIL. Then:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "cd:favorites" },
  ),
);
```
Run again → PASS.

- [ ] **Step 6: Create `src/store/promo.store.ts` and `src/store/recently-viewed.store.ts`** (no separate tests — thin)

`promo.store.ts`:
```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PromoState { code: string | null; setCode: (code: string | null) => void; }

export const usePromoStore = create<PromoState>()(
  persist((set) => ({ code: null, setCode: (code) => set({ code }) }), { name: "cd:promo" }),
);
```

`recently-viewed.store.ts`:
```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState { ids: string[]; push: (id: string) => void; }

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8) })),
    }),
    { name: "cd:recent" },
  ),
);
```

- [ ] **Step 7: Write `src/store/auth.store.test.ts`**

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import { DEMO_CREDENTIALS } from "@/mocks/users";

const auth = () => useAuthStore.getState();

describe("auth.store", () => {
  beforeEach(() => { localStorage.clear(); useAuthStore.setState({ user: null, status: "idle" }); });
  it("logs in and stores the session user", async () => {
    await auth().login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(auth().user?.email).toBe(DEMO_CREDENTIALS.email);
    expect(auth().status).toBe("authenticated");
  });
  it("logs out", async () => {
    await auth().login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    auth().logout();
    expect(auth().user).toBeNull();
  });
});
```

- [ ] **Step 8: Run — verify failure, then implement `src/store/auth.store.ts`**

Run: `pnpm test src/store/auth.store.test.ts` → FAIL. Then:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/types";
import { authService } from "@/services/auth";

type AuthStatus = "idle" | "authenticated";

interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",
      login: async (email, password) => {
        const user = await authService.login(email, password);
        set({ user, status: "authenticated" });
      },
      register: async (input) => {
        const user = await authService.register(input);
        set({ user, status: "authenticated" });
      },
      logout: () => set({ user: null, status: "idle" }),
    }),
    { name: "cd:auth", partialize: (s) => ({ user: s.user }) },
  ),
);
```
Run again → PASS.

- [ ] **Step 9: Full suite, typecheck, lint, commit**

Run: `pnpm test` → all PASS. `pnpm typecheck` → clean. `pnpm lint` → clean (fix any warnings).
```bash
git add -A
git commit -m "feat: add zustand stores (cart, favorites, promo, recently-viewed, auth, ui)"
```

- [ ] **Step 10: Final foundation verification**

Run: `pnpm build`
Expected: production build succeeds. Foundation complete — engine ready for UI phases.

---

## Self-Review (completed during authoring)

**1. Spec coverage** — Stack/architecture (T1–3), tokens/fonts (T2), types (T4), lib incl. hours/pricing/query/facets/validation (T5), mocks incl. fusion menu + Unsplash (T6), services incl. order/reservation/auth (T7), stores (T8). Routes, landing/parallax hero, UI components, account/checkout/reservation *pages* are intentionally deferred to phases 2–6 (this plan is the headless foundation). No spec requirement in scope is unimplemented.

**2. Placeholder scan** — No "TBD/TODO". The only "extend this" instructions (Task 6 items) ship a complete, runnable pattern + concrete examples + acceptance test (`ITEMS.length ≥ 35`, all cuisines present), which is an executable spec, not a placeholder.

**3. Type consistency** — `withDelay`, `menuService.list/getBySlug/byCategory/facets`, `orderService.create/list/get`, `reservationService.slots/create/list/cancel`, `authService.login/register` + `AuthError`, `calcTotals({items,fulfillment,tip,promoCode})`, `CartItem.key/unitPrice/maxQty`, store keys `cd:*` — names/signatures match across tasks and the type module.

---

## Next phases (separate plans, written just-in-time)
2. **Landing + site shell + design-system components** (navbar/footer/providers, the layered-parallax coffee-jar hero + `use-parallax`, home sections) — pairs with ui-ux-pro-max / frontend-design.
3. **Commerce** (menu/catalog, item detail, cart drawer, checkout, success).
4. **Reservations** (booking flow + confirmation + account list).
5. **Content & account** (about, gallery, visit, events, contact, faq, policies, auth pages, account/*).
6. **Polish** (SEO: robots/sitemap/metadata, a11y + reduced-motion audit, responsive QA, empty/loading states).
