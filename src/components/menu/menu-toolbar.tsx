"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { toggleCsv } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

const CUISINES = [
  { id: "cafe", label: "Coffee" },
  { id: "italian", label: "Italian" },
  { id: "indian", label: "Indian" },
  { id: "fusion", label: "Fusion" },
];
const DIETARY = [
  { id: "veg", label: "Veg" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "spicy", label: "Spicy" },
];
const SORTS = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Top rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
];

export function MenuToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [term, setTerm] = useState(sp.get("q") ?? "");

  const cuisineCsv = sp.get("cuisine") ?? "";
  const dietaryCsv = sp.get("dietary") ?? "";
  const sort = sp.get("sort") ?? "popular";
  const hasFilters = Boolean(cuisineCsv || dietaryCsv || sp.get("q") || (sort && sort !== "popular"));

  function push(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }
  function toggle(key: string, id: string) {
    setParam(key, toggleCsv(sp.get(key) ?? undefined, id));
  }
  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam("q", term.trim());
  }

  function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "focus-ring rounded-full border px-3.5 py-1.5 text-sm transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:border-brand/40 hover:text-brand",
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {CUISINES.map((c) => (
          <Chip key={c.id} active={cuisineCsv.split(",").includes(c.id)} onClick={() => toggle("cuisine", c.id)}>
            {c.label}
          </Chip>
        ))}
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        {DIETARY.map((d) => (
          <Chip key={d.id} active={dietaryCsv.split(",").includes(d.id)} onClick={() => toggle("dietary", d.id)}>
            {d.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={submitSearch} className="relative flex-1 sm:max-w-xs">
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search the menu…"
            aria-label="Search the menu"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Sort</span>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "popular" ? "" : e.target.value)}
              className="h-10 rounded-full border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setTerm("");
                push(new URLSearchParams());
              }}
              className="focus-ring flex items-center gap-1 rounded-md px-1 text-sm text-brand hover:text-foreground"
            >
              <X className="size-3.5" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
