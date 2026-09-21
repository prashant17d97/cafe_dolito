"use client";

import Image from "next/image";
import { SceneVideo } from "./scene-video";
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
          // Raw --p on both: the dolly is linear, so an eased fade would run the
          // reveal and the camera move on two different curves.
          transform: "scale(calc(1.15 - var(--p, 0) * 0.15))",
          opacity: "var(--p, 0)",
          willChange: "transform, opacity",
        }}
      >
        <SceneVideo src="/tour/table.mp4" poster="/tour/table-wide.jpg" alt="" sizes="100vw" />
      </div>

      {/* Plate — starts close, pulls back */}
      <div
        className="absolute inset-0 motion-reduce:opacity-100! motion-reduce:[transform:none]!"
        style={{
          transform: "scale(calc(1.45 - var(--p, 0) * 0.45))",
          opacity: "calc(1 - var(--p, 0) * 1.3)",
          willChange: "transform, opacity",
        }}
      >
        {/* eager — the plate is scene 5's rest frame (the wide table behind it
            starts at opacity 0), so this is what a fast scroll lands on. */}
        <Image
          src="/tour/table-plate.jpg"
          alt="A shared plate and an espresso on the marble, hands reaching in"
          fill
          loading="eager"
          fetchPriority="low"
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.55)]" />

      <div className="relative flex h-full items-center">
        <Container className="text-center">
          <div
            className="motion-reduce:opacity-100! motion-reduce:[transform:none]!"
            style={{
              transform: "translateY(calc((1 - var(--p, 0)) * 40px))",
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
