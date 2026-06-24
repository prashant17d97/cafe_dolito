import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/mocks/categories";
import { menuService } from "@/services/menu";
import { Container } from "@/components/common/container";
import { MenuItemCard } from "@/components/menu/menu-item-card";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return { title: cat ? cat.name : "Menu" };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const items = await menuService.byCategory(slug);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <Link href="/menu" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-brand hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All menu
        </Link>
        <header className="mt-4 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">{cat.cuisine}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">{cat.name}</h1>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </div>
  );
}
