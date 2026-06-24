"use client";

import { useEffect, useState } from "react";
import { ITEMS } from "@/mocks/items";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { MenuItemCard } from "@/components/menu/menu-item-card";

/** Records the current item as viewed and shows other recently-viewed items. */
export function RecentlyViewed({ currentId }: { currentId: string }) {
  const ids = useRecentlyViewedStore((s) => s.ids);
  const push = useRecentlyViewedStore((s) => s.push);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    push(currentId);
    setMounted(true);
  }, [currentId, push]);

  if (!mounted) return null;

  const items = ids
    .filter((id) => id !== currentId)
    .map((id) => ITEMS.find((i) => i.id === id))
    .filter((i): i is (typeof ITEMS)[number] => Boolean(i))
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="mt-20" aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="mb-6 font-display text-2xl font-semibold text-foreground">
        Recently viewed
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => <MenuItemCard key={i.id} item={i} />)}
      </div>
    </section>
  );
}
