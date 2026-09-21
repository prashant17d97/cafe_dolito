"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SceneVideoProps {
  /** Looping clip, e.g. "/tour/door.mp4". */
  src: string;
  /** The still this scene already used — stays as the layer's base image. */
  poster: string;
  /** "" for a decorative layer; real text for a meaningful one. */
  alt: string;
  className?: string;
  sizes?: string;
  /** Only ever true for the LCP image (scene 1's backplate). */
  priority?: boolean;
}

/**
 * A scene layer that plays a short ambient clip while its scene is on screen.
 *
 * The clip runs on its OWN timeline at the video's frame rate — it is never
 * scrubbed by scroll. Scroll-seeking a video cannot decode fast enough and
 * judders; letting it play means motion stays smooth no matter how fast the
 * page is scrolled, while scroll keeps driving only the compositing around it.
 *
 * The still is LAYERED UNDER the video, never swapped for it, and the video
 * carries no `poster`. A poster is a raw /tour/*.jpg: it bypasses next/image
 * entirely, so hydration re-downloaded the same five stills unoptimised (~3.2 MB)
 * on top of the optimised copies the server render already fetched. A <video>
 * with no decoded frame is transparent, so the optimised still simply shows
 * through until playback starts — and keeps showing through forever if autoplay
 * is blocked, which is the correct degradation. It also keeps `alt` in the
 * client DOM; a <video> without controls has no reliable ARIA role mapping, so
 * an aria-label on it was not dependably exposed. The clip is decoration, hence
 * aria-hidden. Under prefers-reduced-motion it is never mounted at all.
 */
export function SceneVideo({
  src,
  poster,
  alt,
  className,
  sizes = "100vw",
  priority,
}: SceneVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setMotionOk(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!motionOk || !el || typeof IntersectionObserver === "undefined") return;

    // rootMargin buys a screen of runway so the clip is decoded and ready
    // BEFORE its scene arrives — a fast scroll must not land on a blank frame.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.01, rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // react-dom hoists a high-priority <link rel=preload as=image> into
        // <head> for every eager server <img>. fetchPriority="low" is its own
        // opt-out: these layers still load, but they stop racing the LCP image
        // and stop filling React's 10-slot preload budget.
        fetchPriority={priority ? undefined : "low"}
        className={cn("object-cover", className)}
      />
      {motionOk && (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          // "none", not "auto": five autoloading clips would fetch ~1.8 MB up
          // front and undo the point of gating them. The observer's 100%
          // rootMargin starts the fetch a screen ahead, and the still underneath
          // shows through until the first frame decodes.
          preload="none"
          aria-hidden
          // Only reveal the clip once it is genuinely playing. Until then the
          // optimised still underneath is what you see. This removes any
          // dependence on an undecoded <video> painting transparent rather than
          // black — behaviour that is standard but not worth betting the hero on —
          // and doubles as a soft crossfade from still to motion. If autoplay is
          // ever blocked, `playing` never flips and the still simply stays.
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-700 ease-out motion-reduce:transition-none",
            playing ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      )}
    </>
  );
}
