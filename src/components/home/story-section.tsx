import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { StatCounters } from "./stat-counters";
import { IMG, unsplash } from "@/mocks/images";

export function StorySection() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-sm">
            <Image
              src={unsplash(IMG.interior, 1000)}
              alt="The Café Dolitó roastery and open kitchen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-basil via-caramel to-marigold" />
          </div>

          <div className="space-y-8">
            <SectionHeading
              eyebrow="From bean to plate"
              title="Where Italy meets India over a slow roast"
              description="We started as a two-bag roastery with a wood-fired oven out back. Then our Neapolitan baker and our Punjabi chef started cooking together — and the Fusion Table was born."
            />
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Today every cup is roasted in-house and every plate is built to share. Italian
              technique, Indian spice, and coffee good enough to stand on its own.
            </p>
            <StatCounters />
            <Link
              href="/about"
              className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-brand hover:text-foreground"
            >
              Read our story →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
