"use client";

import { useRef } from "react";
import { useParallax } from "@/features/use-parallax";
import { cn } from "@/lib/utils";

interface TourStageProps {
  /** DOM id — the rail anchors to this. */
  id: string;
  /** Accessible name for the section landmark. */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A pinned scroll stage. Owns pinning and scroll progress, nothing else.
 *
 * useParallax writes --p (raw 0→1) and --p-eased (easeOutCubic) onto the
 * outer element; children read them from inline calc(). Under
 * prefers-reduced-motion the hook pins both to 0 AND the layout drops out
 * of the pin entirely, so the stage becomes an ordinary stacked section.
 *
 * ponytail: one rAF scroll listener per stage, ungated. Rect reads are cheap
 * and already frame-throttled; if five stages ever measure slow, gate each
 * hook on an IntersectionObserver so off-screen stages stop computing.
 */
export function TourStage({ id, label, children, className }: TourStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref as React.RefObject<HTMLElement | null>);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cn(
        "relative h-[180vh] motion-reduce:h-auto motion-reduce:min-h-[60vh] motion-reduce:overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "sticky top-0 h-svh overflow-hidden bg-background",
          // min-h must repeat here, not only on the <section>: under reduced
          // motion this div is static + h-auto, so the copy's h-full resolves
          // against an auto height and collapses to the top instead of centring.
          "motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-[60vh]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
