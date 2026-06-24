"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuItem } from "@/types";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { HomeItemCard } from "./home-item-card";
import { cn } from "@/lib/utils";

export function FusionCarousel({ items }: { items: MenuItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <section className="bg-muted py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The Fusion Table"
          title="Italian, cooked in Indian style"
          description="The dishes people travel for — where a Napoletana crust meets the tandoor and risotto simmers in makhani cream."
          action={
            <Link href="/collections/the-fusion-table" className="font-mono text-xs uppercase tracking-widest text-brand hover:text-foreground">
              See the whole table →
            </Link>
          }
        />
        <div className="mt-10 flex items-center justify-end gap-2">
          {(["prev", "next"] as const).map((dir) => {
            const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
            const disabled = dir === "prev" ? !canPrev : !canNext;
            return (
              <button
                key={dir}
                type="button"
                aria-label={dir === "prev" ? "Previous dishes" : "More dishes"}
                onClick={() => (dir === "prev" ? emblaApi?.scrollPrev() : emblaApi?.scrollNext())}
                disabled={disabled}
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  disabled && "cursor-not-allowed opacity-40",
                )}
              >
                <Icon className="size-5" />
              </button>
            );
          })}
        </div>
      </Container>
      <div className="mt-6 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 px-4 sm:px-6 lg:px-8">
          {items.map((item) => (
            <HomeItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
