import type { Metadata } from "next";
import { menuService } from "@/services/menu";
import { CATEGORIES } from "@/mocks/categories";
import { parseProductQuery } from "@/lib/catalog-params";
import { Container } from "@/components/common/container";
import { MenuToolbar } from "@/components/menu/menu-toolbar";
import { MenuItemCard } from "@/components/menu/menu-item-card";

export const metadata: Metadata = {
  title: "Menu",
  description: "Order coffee, Italian, Indian and fusion dishes for pickup or delivery.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MenuPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") usp.set(k, v);
    else if (Array.isArray(v)) usp.set(k, v.join(","));
  }
  const query = parseProductQuery(usp);
  const items = await menuService.all(query);

  const groups = CATEGORIES.map((cat) => ({
    cat,
    list: items.filter((i) => i.categorySlug === cat.slug),
  })).filter((g) => g.list.length > 0);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">The all-day menu</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Coffee, Italy &amp; India
          </h1>
          <p className="mt-3 text-muted-foreground">
            Order anything for pickup or delivery. Filter by kitchen or diet, or search by name.
          </p>
        </header>

        <div className="mt-8">
          <MenuToolbar />
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {items.length} {items.length === 1 ? "dish" : "dishes"}
        </p>

        {groups.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl text-foreground">Nothing matches that.</p>
            <p className="mt-2 text-muted-foreground">Try clearing a filter or searching for something else.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-14">
            {groups.map(({ cat, list }) => (
              <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
                <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
                  <h2 id={`cat-${cat.slug}`} className="font-display text-2xl font-semibold text-foreground">
                    {cat.name}
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{cat.cuisine}</span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
