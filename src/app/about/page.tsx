import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IMG, unsplash } from "@/mocks/images";
import { VALUES } from "@/mocks/content";
import { SITE } from "@/lib/site";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our story",
  description: "How Café Dolitó came to set one table between Italy and India — and put coffee at the heart of it.",
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={unsplash(IMG.interior, 1600)} alt="" aria-hidden fill sizes="100vw" className="object-cover" priority />
        <div aria-hidden className="absolute inset-0 bg-secondary/65" />
        <Container className="relative py-24 text-secondary-foreground sm:py-32">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary-foreground/80">Our story</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-6xl">Two grandmothers, one espresso machine</h1>
          <p className="mt-4 max-w-xl text-secondary-foreground/85">{SITE.tagline}</p>
        </Container>
      </section>

      {/* narrative */}
      <Container className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <Reveal className="space-y-5 text-muted-foreground">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">A café first, a kitchen always</h2>
          <p>Café Dolitó began at a counter — a lever machine, a sack of single-origin beans, and the stubborn belief that a good morning starts with a good cup. Coffee is still the soul of the house.</p>
          <p>The kitchen grew from two homes. One cooked Sunday ragù and folded pasta by hand; the other ground its own garam masala and kept the tandoor hot. When the two started sharing a stove, the fusion table was born — Italian technique meeting Indian spice, never as a gimmick, only when it tastes inevitable.</p>
          <p>Today we roast in-house, change the specials with the season, and set one table where Naples and New Delhi feel like neighbours.</p>
        </Reveal>
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-sm" delay={120}>
          <Image src={unsplash(IMG.pasta, 900)} alt="Hand-rolled pasta in the kitchen" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        </Reveal>
      </Container>

      {/* values */}
      <Container className="mt-20">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">What we believe</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm" delay={i * 80}>
              <span className="font-mono text-sm text-brand">0{i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* cta */}
      <Container className="mt-20">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-secondary px-6 py-14 text-center text-secondary-foreground">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Come sit at our table</h2>
          <p className="max-w-md text-secondary-foreground/85">Book a table, or just drop in for a cup — the counter is always open.</p>
          <div className="mt-2 flex gap-3">
            <Button asChild size="lg"><Link href="/reserve">Reserve a table</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/menu">See the menu</Link></Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
