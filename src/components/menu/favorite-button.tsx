"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore } from "@/store/favorites.store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  itemId, name, className,
}: {
  itemId: string; name: string; className?: string;
}) {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const active = mounted && ids.includes(itemId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const willAdd = !ids.includes(itemId);
    toggle(itemId);
    toast.success(willAdd ? `${name} saved to favorites` : `${name} removed from favorites`);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
      className={cn(
        "focus-ring flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:text-brand",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-colors", active ? "animate-heart-pop fill-primary text-primary" : "fill-transparent")} />
    </button>
  );
}
