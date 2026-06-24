import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collectionService } from "@/services/collection";
import { Container } from "@/components/common/container";

export const metadata: Metadata = {
  title: "Collections",
  description: "Italian classics, Indian soul, the fusion table, roaster's picks and what's in season.",
};

export default async function CollectionsPage() {
  const collections = await collectionService.list();

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Curated</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Collections</h1>
          <p className="mt-3 text-muted-foreground">Handpicked menus — from Neapolitan classics to the fusion table.</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative isolate flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-3xl border border-border p-6 text-secondary-foreground shadow-sm"
            >
              <Image
                src={c.image}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div aria-hidden className="absolute inset-0 bg-secondary/55" />
              <div className="relative">
                <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
                <p className="mt-1 text-sm text-secondary-foreground/85">{c.tagline}</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-secondary-foreground/75">
                  {c.items.length} {c.items.length === 1 ? "dish" : "dishes"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
