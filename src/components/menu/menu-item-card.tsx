"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { buildCartItem } from "@/features/use-cart";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "./favorite-button";

function badgeFor(item: MenuItem): string | null {
  if (item.dietary.includes("chefs-special")) return "Chef's special";
  if (item.dietary.includes("new")) return "New";
  if (item.dietary.includes("bestseller")) return "Bestseller";
  if (item.dietary.includes("seasonal")) return "Seasonal";
  return null;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const badge = badgeFor(item);
  const image = item.images[0];

  function quickAdd() {
    addItem(buildCartItem(item));
    setCartOpen(true);
    toast.success(`${item.name} added to your order`);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/item/${item.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brand shadow-sm">
            {badge}
          </span>
        )}
      </Link>
      <FavoriteButton itemId={item.id} name={item.name} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/item/${item.slug}`}>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
            {item.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          {item.veg && <span className="font-mono uppercase tracking-wider text-basil">Veg</span>}
          {item.spice ? (
            <span className="flex items-center gap-0.5" aria-label={`Spice level ${item.spice} of 3`}>
              {Array.from({ length: item.spice }).map((_, i) => (
                <span key={i} aria-hidden className="size-1.5 rounded-full bg-marigold" />
              ))}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
          <Button size="sm" onClick={quickAdd} className="gap-1">
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
