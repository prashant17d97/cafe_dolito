import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { IMG, unsplash } from "@/mocks/images";
import { SITE } from "@/lib/site";

const SHOTS: { img: string; alt: string }[] = [
  { img: IMG.gallery1, alt: "Morning light over the café counter" },
  { img: IMG.pizza, alt: "A blistered Napoletana pizza fresh from the oven" },
  { img: IMG.biryani, alt: "A pot of fragrant biryani being served" },
  { img: IMG.latte, alt: "Latte art in a warm ceramic cup" },
  { img: IMG.tandoor, alt: "Skewers char-grilling in the tandoor" },
  { img: IMG.gallery2, alt: "Guests sharing plates at a sunny table" },
];

export function GalleryStrip() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">From the café</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            A look around the room
          </h2>
        </div>
        <Link
          href={SITE.socials.instagram}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-brand hover:text-foreground"
        >
          @cafedolito →
        </Link>
      </Container>
      <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {SHOTS.map((shot, i) => (
          <div
            key={i}
            className="relative aspect-square w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-border sm:w-72"
          >
            <Image
              src={unsplash(shot.img, 600)}
              alt={shot.alt}
              fill
              loading="lazy"
              sizes="288px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
