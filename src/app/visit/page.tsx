import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Car, Train } from "lucide-react";
import { IMG, unsplash } from "@/mocks/images";
import { SITE } from "@/lib/site";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { VisitHours } from "@/components/visit/visit-hours";

export const metadata: Metadata = {
  title: "Visit us",
  description: `Find Café Dolitó at ${SITE.address.line1}, ${SITE.address.city}. Opening hours, parking and contact.`,
};

const tel = SITE.phone.replace(/[^\d+]/g, "");

export default function VisitPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Come by</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Visit us</h1>
        <p className="mt-3 text-muted-foreground">In the heart of {SITE.address.city}. Walk in for coffee, or book ahead for dinner.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* map + address */}
        <div className="space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-sm">
            <Image src={unsplash(IMG.interior, 1400)} alt="The Café Dolitó storefront" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-secondary/50 to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={MapPin} title="Address">
              {SITE.address.line1}<br />{SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </InfoCard>
            <InfoCard icon={Phone} title="Phone">
              <a href={`tel:${tel}`} className="hover:text-brand">{SITE.phone}</a>
            </InfoCard>
            <InfoCard icon={Mail} title="Email">
              <a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a>
            </InfoCard>
            <InfoCard icon={Car} title="Getting here">
              Street parking on Almond Row. <Train className="inline size-3.5" /> 5 min from the transit mall.
            </InfoCard>
          </div>
        </div>

        {/* hours + cta */}
        <div className="space-y-6">
          <VisitHours />
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <h2 className="font-display text-lg font-semibold text-foreground">Planning dinner?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tables fill up on weekends — reserve in under a minute.</p>
            <Button asChild className="mt-4 w-full"><Link href="/reserve">Reserve a table</Link></Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="flex size-9 items-center justify-center rounded-full bg-accent/60 text-brand">
        <Icon className="size-4" />
      </span>
      <h3 className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">{title}</h3>
      <p className="mt-1 text-sm text-foreground">{children}</p>
    </div>
  );
}
