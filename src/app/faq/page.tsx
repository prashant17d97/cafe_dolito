import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/mocks/content";
import { Container } from "@/components/common/container";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Reservations, dietary needs, parking and more — answers to common questions about Café Dolitó.",
};

export default function FaqPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Good to know</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Frequently asked</h1>
        <p className="mt-3 text-muted-foreground">Can’t find it here? <Link href="/contact" className="text-brand hover:underline">Send us a note</Link>.</p>
      </header>

      <div className="mt-10 max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-medium text-foreground">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <h2 className="font-display text-lg font-semibold text-foreground">Still have a question?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Our team is happy to help with bookings, allergies and events.</p>
        <Button asChild className="mt-4"><Link href="/contact">Contact us</Link></Button>
      </div>
    </Container>
  );
}
