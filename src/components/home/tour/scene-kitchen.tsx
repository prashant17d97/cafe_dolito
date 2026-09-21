"use client";

import Image from "next/image";
import { SceneVideo } from "./scene-video";

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
        className="absolute inset-0 motion-reduce:opacity-100!"
        style={{ opacity: "calc(var(--p, 0) * 1.6)", willChange: "opacity" }}
      >
        <SceneVideo
          src="/tour/kitchen.mp4"
          poster="/tour/kitchen-fusion.jpg"
          alt="Paccheri in a spiced masala sauce, finished with basil and coriander"
          sizes="100vw"
        />
      </div>

      {/* Italy — slides in from the left */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 motion-reduce:[transform:none]!"
        style={{
          transform: "translate3d(calc((1 - var(--p, 0)) * -55%), 0, 0)",
          willChange: "transform",
        }}
      >
        {/* eager — both halves together ARE scene 4's rest frame, so both load up front. */}
        <Image src="/tour/kitchen-italy.jpg" alt="" fill loading="eager" fetchPriority="low" sizes="50vw" className="object-cover" />
      </div>

      {/* India — slides in from the right */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 motion-reduce:[transform:none]!"
        style={{
          transform: "translate3d(calc((1 - var(--p, 0)) * 55%), 0, 0)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/kitchen-india.jpg" alt="" fill loading="eager" fetchPriority="low" sizes="50vw" className="object-cover" />
      </div>

      {/* Motifs cross at the seam as the halves close. The SVG components take
          only className, so the transform lives on a positioned wrapper. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[28%] motion-reduce:hidden"
        style={{
          transform: "translate3d(calc(var(--p, 0) * 120px - 60px), 0, 0)",
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
          transform: "translate3d(calc(60px - var(--p, 0) * 120px), 0, 0)",
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
            className="max-w-md motion-reduce:[transform:none]!"
            style={{
              transform: "translateY(calc((0.5 - var(--p, 0)) * 40px))",
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
