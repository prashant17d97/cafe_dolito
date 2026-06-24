import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import { Container } from "@/components/common/container";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, feedback, or an event in mind? Get in touch with Café Dolitó.",
};

const tel = SITE.phone.replace(/[^\d+]/g, "");

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Say hello</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Contact</h1>
        <p className="mt-3 text-muted-foreground">We read every message — about a booking, an event, feedback, or just to chat coffee.</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="space-y-4">
          <Detail icon={MapPin} title="Visit">
            {SITE.address.line1}<br />{SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </Detail>
          <Detail icon={Phone} title="Call">
            <a href={`tel:${tel}`} className="hover:text-brand">{SITE.phone}</a>
          </Detail>
          <Detail icon={Mail} title="Email">
            <a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a>
          </Detail>
        </aside>
      </div>
    </Container>
  );
}

function Detail({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/60 text-brand">
        <Icon className="size-4" />
      </span>
      <div>
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{title}</h2>
        <p className="mt-1 text-sm text-foreground">{children}</p>
      </div>
    </div>
  );
}
