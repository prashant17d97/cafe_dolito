import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export function ReserveCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <Container className="py-20 text-center sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground/75">
          Lunch, dinner &amp; lazy weekend brunch
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Pull up a chair
        </h2>
        <p className="mx-auto mt-4 max-w-md text-primary-foreground/85">
          Book a table for two or twenty. We&apos;ll have the coffee on and the oven hot.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-background px-8 text-foreground hover:bg-accent"
          >
            <Link href="/reserve">Reserve a table</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/menu">See the menu</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
