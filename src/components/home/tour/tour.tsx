import { SceneDoor } from "./scene-door";
import { SceneRoast } from "./scene-roast";
import { SceneBar } from "./scene-bar";
import { SceneKitchen } from "./scene-kitchen";
import { SceneTable } from "./scene-table";
import { TourRail } from "./tour-rail";

/**
 * The café tour: five pinned scenes read as one continuous walk from the
 * street door to the communal table.
 */
export function Tour() {
  return (
    <div className="relative">
      <a
        href="#after-tour"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip the tour
      </a>

      <TourRail />

      <SceneDoor />
      <SceneRoast />
      <SceneBar />
      <SceneKitchen />
      <SceneTable />
    </div>
  );
}
