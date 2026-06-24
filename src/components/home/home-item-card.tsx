import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function topBadge(item: MenuItem): string | null {
  if (item.dietary.includes("chefs-special")) return "Chef's special";
  if (item.dietary.includes("new")) return "New";
  if (item.dietary.includes("bestseller")) return "Bestseller";
  if (item.dietary.includes("seasonal")) return "Seasonal";
  return null;
}

export function HomeItemCard({ item, className }: { item: MenuItem; className?: string }) {
  const badge = topBadge(item);
  const image = item.images[0];
  return (
    <Link
      href={`/item/${item.slug}`}
      className={cn(
        "group flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image?.src ?? ""}
          alt={image?.alt ?? item.name}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brand shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
          <div className="flex items-center gap-2">
            {item.veg && <span className="font-mono text-[10px] uppercase tracking-wider text-basil">Veg</span>}
            {item.spice ? (
              <span className="flex items-center gap-0.5" aria-label={`Spice level ${item.spice} of 3`}>
                {Array.from({ length: item.spice }).map((_, i) => (
                  <span key={i} aria-hidden className="size-1.5 rounded-full bg-marigold" />
                ))}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
