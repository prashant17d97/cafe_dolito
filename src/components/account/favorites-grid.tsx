"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ITEMS } from "@/mocks/items";
import { useFavoritesStore } from "@/store/favorites.store";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Button } from "@/components/ui/button";

export function FavoritesGrid() {
  const ids = useFavoritesStore((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const items = useMemo(() => ITEMS.filter((i) => ids.includes(i.id)), [ids]);

  if (!mounted) return <p className="py-16 text-center text-muted-foreground">Loading…</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="text-muted-foreground">No favorites yet — tap the heart on any dish to save it.</p>
        <Button asChild className="mt-5"><Link href="/menu">Browse the menu</Link></Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => <MenuItemCard key={item.id} item={item} />)}
    </div>
  );
}
