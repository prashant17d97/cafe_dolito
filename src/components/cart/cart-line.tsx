"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";
import { QuantityStepper } from "@/components/common/quantity-stepper";

export function CartLine({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const optionSummary = item.selections.map((s) => s.valueLabel).join(" · ");

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/item/${item.slug}`}
        onClick={onNavigate}
        className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border"
      >
        {item.image && (
          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/item/${item.slug}`} onClick={onNavigate} className="font-display text-sm font-semibold leading-tight text-foreground hover:text-brand">
            {item.name}
          </Link>
          <button
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => remove(item.key)}
            className="focus-ring rounded-md text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
        {optionSummary && <p className="mt-0.5 text-xs text-muted-foreground">{optionSummary}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper value={item.quantity} max={item.maxQty} onChange={(n) => setQty(item.key, n)} />
          <span className="font-mono text-sm font-medium text-foreground">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
