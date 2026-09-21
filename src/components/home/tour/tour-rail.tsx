"use client";

import { useActiveScene } from "@/features/use-active-scene";
import { TOUR_SCENES, TOUR_SCENE_IDS } from "@/mocks/tour";
import { cn } from "@/lib/utils";

/**
 * Progress rail. Sticky rather than fixed, so it lives and dies with the tour
 * instead of following the reader down the rest of the page.
 *
 * These are real anchor links, not decorative dots — they double as the
 * keyboard route through the tour.
 */
export function TourRail() {
  const active = useActiveScene(TOUR_SCENE_IDS);

  return (
    <nav
      aria-label="Café tour"
      className="pointer-events-none sticky top-1/2 z-30 hidden h-0 lg:block"
    >
      <ol className="pointer-events-auto absolute right-6 flex -translate-y-1/2 flex-col gap-4">
        {TOUR_SCENES.map((scene) => {
          const isActive = active === scene.id;
          return (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                aria-current={isActive ? "true" : undefined}
                className="flex items-center justify-end gap-2 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span className="sr-only">{scene.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive ? "h-2.5 w-2.5 bg-white" : "h-1.5 w-1.5 bg-white/45",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
