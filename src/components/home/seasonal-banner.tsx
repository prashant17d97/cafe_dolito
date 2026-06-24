import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { IMG, unsplash } from "@/mocks/images";

export function SeasonalBanner() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={unsplash(IMG.latte, 1800)}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-secondary/70" />
      <Container className="relative z-10 py-20 text-center text-secondary-foreground sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary-foreground/80">
          On now · while it lasts
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
          The season of cardamom-rose lattes &amp; saffron tiramisù
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-secondary-foreground/85 sm:text-base">
          A short menu of limited drops, roasted and plated while the weather&apos;s right.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-background px-7 text-foreground hover:bg-accent"
        >
          <Link href="/collections/seasonal">See the seasonal menu</Link>
        </Button>
      </Container>
    </section>
  );
}
