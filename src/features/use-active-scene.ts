"use client";
import { useEffect, useState } from "react";

/**
 * Reports which of the given element ids is currently centred in the viewport.
 * `ids` should be a module-level constant; identity is not depended on — the
 * effect keys off the joined string so an inline array will not thrash.
 */
export function useActiveScene(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const key = ids.join(",");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // A narrow band across the viewport's middle: whichever scene crosses the
    // centre line is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
