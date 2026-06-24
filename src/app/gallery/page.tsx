import type { Metadata } from "next";
import Image from "next/image";
import { GALLERY } from "@/mocks/content";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Inside Café Dolitó — the room, the coffee, the kitchen where Italy meets India.",
};

export default function GalleryPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Look around</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Gallery</h1>
        <p className="mt-3 text-muted-foreground">The room, the cups, the plates that come out of two kitchens at once.</p>
      </header>

      <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[260px] lg:grid-cols-4">
        {GALLERY.map((shot, i) => (
          <Reveal
            key={shot.src}
            delay={(i % 4) * 60}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border shadow-sm",
              shot.span && "row-span-2",
            )}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
