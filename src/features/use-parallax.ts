"use client";
import { useEffect } from "react";

/** Scroll progress of a tall sticky stage, clamped to [0,1]. */
export function parallaxProgress(rect: { top: number; height: number }, viewportH: number): number {
  const scrollable = rect.height - viewportH;
  if (scrollable <= 0) return 0;
  const scrolled = -rect.top;
  return Math.min(1, Math.max(0, scrolled / scrollable));
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useParallax(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.style.setProperty("--p", "0"); el.style.setProperty("--p-eased", "0"); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = parallaxProgress(el.getBoundingClientRect(), window.innerHeight);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--p-eased", easeOutCubic(p).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ref]);
}
