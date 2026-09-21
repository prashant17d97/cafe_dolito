"use client";

import Image from "next/image";
import { SceneVideo } from "./scene-video";

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
          transform: "translate3d(0, calc(var(--p, 0) * -6%), 0) scale(1.08)",
          willChange: "transform",
        }}
      >
        {/* eager: this is the frame you land on when scene 2 arrives. Lazy-loading
            it lets a fast scroll outrun the loader and the scene pops in blank. */}
        <Image src="/tour/counter-wide.jpg" alt="" fill loading="eager" fetchPriority="low" sizes="100vw" className="object-cover" />
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
        <SceneVideo
          src="/tour/roast.mp4"
          poster="/tour/roast-drum.jpg"
          alt="A copper drum roaster with beans tumbling into the cooling tray"
          sizes="(max-width: 768px) 100vw, 58vw"
        />
      </div>

      {/* Bean plane — drifts counter to everything else */}
      <div
        aria-hidden
        className="absolute -inset-x-12 bottom-0 h-[34%] opacity-60"
        style={{
          transform:
            "translate3d(calc(var(--p, 0) * -7%), calc(var(--p, 0) * 16%), 0)",
          willChange: "transform",
        }}
      >
        <Image src="/tour/beans.jpg" alt="" fill sizes="120vw" className="object-cover" />
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
