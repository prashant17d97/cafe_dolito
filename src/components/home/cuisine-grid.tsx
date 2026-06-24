import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { IMG, unsplash } from "@/mocks/images";
import { cn } from "@/lib/utils";

interface CuisineCard {
  key: string;
  label: string;
  href: string;
  img: string;
  blurb: string;
  edge?: string;
  tag?: string;
}

const CUISINES: CuisineCard[] = [
  { key: "cafe", label: "Coffee", href: "/menu?cuisine=cafe", img: IMG.latte, blurb: "Single-origin espresso, cardamom-rose lattes, nitro cold brew." },
  { key: "italian", label: "Italian", href: "/menu?cuisine=italian", img: IMG.pasta, blurb: "Wood-fired pizza, hand-rolled pasta, proper tiramisù.", edge: "bg-basil" },
  { key: "indian", label: "Indian", href: "/menu?cuisine=indian", img: IMG.curry, blurb: "Tandoor, biryani, street chaat and fresh-pulled naan.", edge: "bg-marigold" },
  { key: "fusion", label: "Fusion", href: "/menu?cuisine=fusion", img: IMG.fusion, blurb: "Italian, cooked in Indian style — our signature table.", edge: "bg-caramel", tag: "Signature" },
];

export function CuisineGrid() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Three kitchens, one counter"
          title="Coffee, Italy & India — on one menu"
          description="Order a flat white and a plate of keema bolognese in the same breath. Everything below is on the all-day menu."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CUISINES.map((c, i) => (
            <Reveal key={c.key} delay={i * 60}>
              <Link
                href={c.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={unsplash(c.img, 700)}
                    alt={`${c.label} at Café Dolitó`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {c.edge && <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-1", c.edge)} />}
                  {c.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-caramel px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary">
                      {c.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">{c.label}</h3>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  <span className="mt-3 font-mono text-xs uppercase tracking-widest text-brand transition-colors group-hover:text-foreground">
                    Browse {c.label} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
