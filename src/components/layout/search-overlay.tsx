"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useUiStore } from "@/store/ui.store";
import { ITEMS } from "@/mocks/items";
import { filterItems } from "@/lib/menu-query";
import { formatPrice } from "@/lib/format";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function SearchOverlay() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const [q, setQ] = useState("");

  const results = useMemo(() => (q.trim() ? filterItems(ITEMS, { q: q.trim() }).slice(0, 8) : []), [q]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ("");
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Search the menu</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search aria-hidden className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes, drinks, beans…"
            aria-label="Search the menu"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {q.trim() === "" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Try tandoori, latte, or tiramisù.</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches for “{q.trim()}”.</p>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border">
                  {item.images[0] && <Image src={item.images[0].src} alt="" fill sizes="40px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="truncate text-xs capitalize text-muted-foreground">{item.cuisine}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{formatPrice(item.price)}</span>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
