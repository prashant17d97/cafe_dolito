import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { menuService } from "@/services/menu";
import { ITEMS } from "@/mocks/items";
import { CATEGORIES } from "@/mocks/categories";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/common/container";
import { AddToOrderPanel } from "@/components/item/add-to-order-panel";
import { FavoriteButton } from "@/components/menu/favorite-button";
import { RecentlyViewed } from "@/components/item/recently-viewed";
import { MenuItemCard } from "@/components/menu/menu-item-card";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = await menuService.getBySlug(slug);
  return { title: item?.name ?? "Menu", description: item?.description };
}

export default async function ItemPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await menuService.getBySlug(slug);
  if (!item) notFound();

  const category = CATEGORIES.find((c) => c.slug === item.categorySlug);
  const related = (await menuService.all({ cuisine: [item.cuisine] }))
    .filter((i) => i.slug !== item.slug)
    .slice(0, 3);
  const image = item.images[0];

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <Link href="/menu" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-brand hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to menu
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border shadow-sm">
            {image && (
              <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            )}
            <FavoriteButton itemId={item.id} name={item.name} className="absolute right-4 top-4 size-11" />
          </div>

          <div className="flex flex-col">
            <p className="font-mono text-xs uppercase tracking-widest text-brand">
              {item.cuisine}
              {category ? ` · ${category.name}` : ""}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{item.name}</h1>
            <p className="mt-2 font-mono text-lg text-foreground">{formatPrice(item.price)}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">{item.description}</p>

            {item.dietary.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.dietary.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <AddToOrderPanel item={item} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-6 font-display text-2xl font-semibold text-foreground">
              You might also like
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((i) => (
                <MenuItemCard key={i.id} item={i} />
              ))}
            </div>
          </section>
        )}

        <RecentlyViewed currentId={item.id} />
      </Container>
    </div>
  );
}
