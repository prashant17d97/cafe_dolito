import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { COLLECTIONS } from "@/mocks/collections";
import { collectionService } from "@/services/collection";
import { Container } from "@/components/common/container";
import { MenuItemCard } from "@/components/menu/menu-item-card";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = await collectionService.get(slug);
  return { title: c ? c.name : "Collections", description: c?.tagline };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = await collectionService.get(slug);
  if (!collection) notFound();

  return (
    <div className="pb-16">
      <section className="relative isolate overflow-hidden">
        <Image src={collection.image} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-secondary/65" />
        <Container className="relative py-16 text-secondary-foreground sm:py-24">
          <Link href="/collections" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-secondary-foreground/80 hover:text-secondary-foreground">
            <ArrowLeft className="size-3.5" /> All collections
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{collection.name}</h1>
          <p className="mt-2 max-w-md text-secondary-foreground/85">{collection.tagline}</p>
        </Container>
      </section>

      <Container className="mt-12">
        {collection.items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Nothing in this collection just yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collection.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
