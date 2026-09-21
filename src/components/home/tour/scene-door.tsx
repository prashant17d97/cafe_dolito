"use client";

import Image from "next/image";
import { SceneVideo } from "./scene-video";
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
          transform: "scale(calc(1 + var(--p, 0) * 0.35))",
          willChange: "transform",
        }}
      >
        <SceneVideo
          src="/tour/door.mp4"
          poster="/tour/door-facade.jpg"
          alt="The Café Dolitó doorway at dusk, warm light spilling across the cobbles"
          priority
          sizes="100vw"
        />
      </div>

      {/* Interior — waits beyond the threshold, resolves as you cross it */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: "calc((var(--p, 0) - 0.45) * 2.4)",
          transform: "scale(calc(1.12 - var(--p, 0) * 0.12))",
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
          // Reads as a photographic vignette at rest (scale 1): clear centre, dark
          // corners. Scaling pushes the dark ring off-screen as you step through.
          // NB: the dark stop must stay near 100% — pulling it in (e.g. 65%) blacks
          // out the façade at --p:0, because at scale 1 that lands mid-viewport.
          background:
            "radial-gradient(ellipse at 38% 52%, rgba(0,0,0,0) 30%, rgba(20,12,6,0.5) 72%, rgba(20,12,6,0.92) 100%)",
          transformOrigin: "38% 52%",
          transform: "scale(calc(1 + var(--p, 0) * 3.2))",
          willChange: "transform",
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
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,12,6,0.72)_0%,rgba(20,12,6,0.4)_45%,transparent_75%)]" />
        <Container className="text-center relative">
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
