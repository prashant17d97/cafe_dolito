"use client";

import Image from "next/image";
import { SceneVideo } from "./scene-video";

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
          transform: "translate3d(0, calc(var(--p, 0) * -5%), 0) scale(1.06)",
          willChange: "transform",
        }}
      >
        {/* eager — the rest frame of scene 3; see scene-roast for why. */}
        <Image src="/tour/bar-portafilter.jpg" alt="" fill loading="eager" fetchPriority="low" sizes="100vw" className="object-cover" />
      </div>

      <div aria-hidden className="absolute inset-0 bg-[rgba(20,12,6,0.6)]" />

      {/* The pour — crema rises with scroll progress */}
      <div className="absolute inset-y-0 right-[6%] hidden w-[38%] items-center md:flex">
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/15 shadow-2xl">
          <div
            className="absolute inset-0 motion-reduce:[clip-path:inset(0)]!"
            style={{
              clipPath: "inset(calc(100% - var(--p, 0) * 100%) 0 0 0)",
              willChange: "clip-path",
            }}
          >
            <SceneVideo
              src="/tour/bar.mp4"
              poster="/tour/cup-crema.jpg"
              alt="An espresso pulled to a thick hazelnut crema"
              sizes="38vw"
              // The round mask lives on an ancestor's overflow-hidden + clip-path.
              // Some engines have historically declined to round-clip a <video>,
              // which would render the cup as a square; clipping it directly too
              // is a one-class insurance policy.
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="relative flex h-full items-center">
        <Container>
          <div
            className="max-w-md motion-reduce:[transform:none]!"
            style={{
              transform: "translateY(calc((0.5 - var(--p, 0)) * 40px))",
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
