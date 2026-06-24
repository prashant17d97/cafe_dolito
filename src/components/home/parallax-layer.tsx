import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface ParallaxLayerProps {
  /**
   * Depth multiplier in px — positive values move the layer slower (towards
   * viewer), negative values move it faster. Applied as:
   *   translateY( calc(var(--p) * var(--depth, 0) * 1px) )
   *
   * The CSS var `--p` (0→1) and `--p-eased` are set on the ancestor stage by
   * useParallax(stageRef). Under prefers-reduced-motion both are pinned to 0
   * so all layers sit at their resting position.
   */
  depth?: number;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

/**
 * A thin positioned layer whose vertical shift is driven purely by the
 * ancestor stage's `--p` CSS custom property — no JS scroll listener of its
 * own. Set `depth` to scale the movement.
 */
export function ParallaxLayer({
  depth = 0,
  className,
  children,
  style,
}: ParallaxLayerProps) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        // CSS-only transform driven by the ancestor stage's --p var.
        transform: `translate3d(0, calc(var(--p, 0) * ${depth} * 1px), 0)`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
