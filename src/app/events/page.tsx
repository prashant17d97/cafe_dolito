import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENTS } from "@/mocks/content";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Private events",
  description: "Buyout dinners, the roastery table and hands-on cook-alongs at Café Dolitó.",
};

export default function EventsPage() {
  return (
    <div className="pb-20">
      <Container className="py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Gather here</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Private events</h1>
          <p className="mt-3 text-muted-foreground">
            Birthdays, teams, or a long lunch with people you like — we’ll set a table that runs from Naples to New Delhi.
          </p>
        </header>

        <div className="mt-12 space-y-8">
          {EVENTS.map((e, i) => (
            <Reveal key={e.title} className="grid items-center gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 sm:p-6" delay={i * 80}>
              <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                  <Image src={e.image} alt={e.title} fill sizes="(max-width: 640px) 100vw, 45vw" className="object-cover" />
                </div>
              </div>
              <div className={i % 2 === 1 ? "sm:order-1" : ""}>
                <p className="font-mono text-xs uppercase tracking-wider text-brand">{e.capacity}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">{e.title}</h2>
                <p className="mt-2 text-muted-foreground">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-secondary px-6 py-12 text-center text-secondary-foreground">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Tell us what you’re celebrating</h2>
          <p className="max-w-md text-secondary-foreground/85">Send a note with your date, party size and idea — we’ll build the rest around it.</p>
          <Button asChild size="lg" className="mt-2"><Link href="/contact">Enquire about an event</Link></Button>
        </div>
      </Container>
    </div>
  );
}
