"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { useParallax } from "@/features/use-parallax";
import { IMG, unsplash } from "@/mocks/images";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline SVG motifs — NO photo crops (they look bad cut out)
// ---------------------------------------------------------------------------

/** Italian: basil leaf */
function BasilLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M24 2C14 12 6 24 8 40c2 12 10 20 16 22C30 60 38 52 40 40c2-16-6-28-16-38z" />
      <line
        x1="24"
        y1="62"
        x2="24"
        y2="30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 44 C18 40 14 34 16 30M24 44 C30 40 34 34 32 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

/** Italian: pasta curl / fusilli */
function PastaCurl({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 44 C6 36 8 24 16 20 C24 16 34 20 36 30 C38 40 30 50 20 48 C10 46 8 36 14 28 C20 20 32 20 38 28"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Italian: small tomato */
function Tomato({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="22" cy="28" rx="18" ry="17" />
      <path
        d="M22 11 C22 4 28 2 30 6 M22 11 C22 4 16 2 14 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M22 11 L22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Indian: cardamom pod */
function CardamomPod({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 56"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="16" cy="26" rx="12" ry="22" opacity="0.9" />
      <line x1="16" y1="4" x2="16" y2="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="10" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="9" y1="26" x2="23" y2="26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="10" y1="34" x2="22" y2="34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M10 6 C10 2 22 2 22 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Indian: star anise */
function StarAnise({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* 8 petals via rotation */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="28"
          cy="28"
          rx="4"
          ry="12"
          transform={`rotate(${deg} 28 28)`}
          opacity="0.85"
        />
      ))}
      <circle cx="28" cy="28" r="4.5" />
    </svg>
  );
}

/** Indian: marigold bloom */
function Marigold({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <ellipse
          key={deg}
          cx="30"
          cy="30"
          rx="5"
          ry="14"
          transform={`rotate(${deg} 30 30)`}
          opacity="0.8"
        />
      ))}
      <circle cx="30" cy="30" r="6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Steam plume — a single blurred white teardrop
// ---------------------------------------------------------------------------
function SteamPlume({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-12 w-2 rounded-full bg-white/70 blur-[3px] animate-steam",
        className,
      )}
      aria-hidden
    />
  );
}

// ---------------------------------------------------------------------------
// HeroParallax
// ---------------------------------------------------------------------------

export function HeroParallax() {
  const stageRef = useRef<HTMLDivElement>(null);
  useParallax(stageRef as React.RefObject<HTMLElement | null>);

  return (
    /**
     * STAGE — tall (180 vh) so the browser has room to scroll.
     * useParallax writes --p (raw 0→1) and --p-eased onto this element.
     * All layers read those vars via inline calc() — zero extra scroll
     * listeners.
     */
    <div
      ref={stageRef}
      className="relative h-[180vh]"
      aria-label="Hero section"
    >
      {/**
       * VIEWPORT — sticky so it stays in view while the stage scrolls.
       * overflow-hidden clips layers that translate outside.
       */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ================================================================
            LAYER 1 — BACKPLATE (slowest, slight scale)
            depth=-20 → moves up slightly on scroll (further-away feel)
        ================================================================= */}
        <div
          className="absolute inset-0"
          style={{
            transform:
              "translate3d(0, calc(var(--p, 0) * -20px), 0) scale(calc(1 + var(--p, 0) * 0.06))",
            willChange: "transform",
            transformOrigin: "center center",
          }}
          aria-hidden
        >
          <Image
            src={unsplash(IMG.heroBackplate, 1800)}
            alt="Warm café interior"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* warm cream → caramel gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in oklch, var(--background) 72%, transparent) 0%, color-mix(in oklch, var(--accent) 50%, transparent) 55%, color-mix(in oklch, var(--background) 80%, transparent) 100%)",
            }}
          />
        </div>

        {/* ================================================================
            LAYER 2 — AMBIENCE ITALY (left, drift up-left on scroll)
        ================================================================= */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform:
              "translate3d(calc(var(--p, 0) * -30px), calc(var(--p, 0) * -50px), 0)",
            willChange: "transform",
          }}
          aria-hidden
        >
          {/* Basil leaf — top-left */}
          <BasilLeaf
            className={cn(
              "absolute left-[6%] top-[14%] w-14 text-basil/50 animate-float",
            )}
          />
          {/* Tomato — mid-left */}
          <Tomato
            className="absolute left-[9%] top-[40%] w-10 text-caramel/40 animate-float [animation-delay:1.4s]"
          />
          {/* Pasta curl — lower-left */}
          <PastaCurl
            className="absolute left-[4%] top-[62%] w-16 text-basil/35 animate-float [animation-delay:2.8s]"
          />
        </div>

        {/* ================================================================
            LAYER 3 — AMBIENCE INDIA (right, drift up-right on scroll)
        ================================================================= */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform:
              "translate3d(calc(var(--p, 0) * 30px), calc(var(--p, 0) * -40px), 0)",
            willChange: "transform",
          }}
          aria-hidden
        >
          {/* Cardamom pod — top-right */}
          <CardamomPod
            className="absolute right-[6%] top-[18%] w-8 text-marigold/55 animate-float [animation-delay:0.8s]"
          />
          {/* Star anise — mid-right */}
          <StarAnise
            className="absolute right-[10%] top-[38%] w-12 text-caramel/45 animate-float [animation-delay:2.1s]"
          />
          {/* Marigold bloom — lower-right */}
          <Marigold
            className="absolute right-[5%] top-[58%] w-14 text-marigold/50 animate-float [animation-delay:3.5s]"
          />
        </div>

        {/* ================================================================
            LAYER 4 — JAR (focal point, center)
            Uses --p-eased for smooth lift/scale; --p for gentle rotate.
        ================================================================= */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          {/* Caramel radial glow behind the jar */}
          <div
            className="absolute"
            style={{
              width: "480px",
              height: "480px",
              background:
                "radial-gradient(ellipse at center, color-mix(in oklch, var(--caramel) 22%, transparent) 0%, transparent 72%)",
              transform: "translateY(40px)",
            }}
          />

          {/* Steam plumes — appear above the jar mouth */}
          <div
            className="absolute flex gap-3"
            style={{
              bottom: "calc(50% + 140px)",
              transform: `translateY(calc(var(--p-eased, 0) * -40px)) scaleY(calc(1 + var(--p-eased, 0) * 0.12))`,
              transformOrigin: "bottom center",
            }}
          >
            <SteamPlume className="[animation-delay:0s]" />
            <SteamPlume className="[animation-delay:0.9s] scale-y-75" />
            <SteamPlume className="[animation-delay:1.8s]" />
          </div>

          {/* The jar itself */}
          <div
            className="relative"
            style={{
              width: "340px",
              height: "440px",
              transform:
                "translateY(calc(var(--p-eased, 0) * -40px)) scale(calc(1 + var(--p-eased, 0) * 0.12)) rotate(calc(var(--p, 0) * 4deg))",
              willChange: "transform",
            }}
          >
            <Image
              src={unsplash(IMG.heroJar, 800)}
              alt="Café Dolitó specialty coffee jar — slow-roasted, single origin"
              fill
              priority
              className="object-contain object-center drop-shadow-2xl"
              sizes="340px"
            />
          </div>
        </div>

        {/* ================================================================
            LAYER 5 — HEADLINE (fastest, slight counter-move + fade)
            translateY(calc(--p * 30px)) moves it down (counter to jar lift)
            opacity fades out as you scroll past
        ================================================================= */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-20"
          style={{
            transform: "translateY(calc(var(--p, 0) * 30px))",
            opacity: "calc(1 - var(--p, 0) * 1.1)",
            willChange: "transform, opacity",
          }}
        >
          <Container className="text-center">
            {/* Eyebrow */}
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand/80 mb-3">
              Specialty coffee · Italian · Indian · Fusion
            </p>

            {/* H1 — exactly one per page */}
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl mb-4 text-balance">
              Italy &amp; India, over coffee.
            </h1>

            {/* Subcopy */}
            <p className="mx-auto max-w-sm text-sm text-muted-foreground mb-8 sm:text-base">
              Slow-roasted single-origin blends. Handmade pasta. Cardamom chai.
              All in one warm corner of the city.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="px-7 py-2.5 text-sm font-semibold tracking-wide"
              >
                <Link href="/menu">View the menu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-7 py-2.5 text-sm font-semibold tracking-wide border-brand/30 text-brand hover:bg-accent hover:text-brand"
              >
                <Link href="/reserve">Reserve a table</Link>
              </Button>
            </div>
          </Container>

          {/* Scroll cue chevron */}
          <div
            className="mt-10 flex flex-col items-center gap-1 text-muted-foreground/60"
            aria-hidden
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">
              scroll
            </span>
            <ChevronDown className="size-4 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
