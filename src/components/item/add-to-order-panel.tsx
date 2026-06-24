"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { buildCartItem } from "@/features/use-cart";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToOrderPanel({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(item.options.map((o) => [o.id, o.values[0]?.id ?? ""])),
  );

  const unitPrice = useMemo(() => {
    const delta = item.options.reduce((sum, o) => {
      const v = o.values.find((vv) => vv.id === selected[o.id]);
      return sum + (v?.priceDelta ?? 0);
    }, 0);
    return item.price + delta;
  }, [item, selected]);

  function add() {
    addItem(buildCartItem(item, selected, qty));
    setCartOpen(true);
    toast.success(`${item.name} added to your order`);
  }

  return (
    <div className="space-y-6">
      {item.options.map((opt) => (
        <fieldset key={opt.id}>
          <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">{opt.name}</legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => {
              const active = selected[opt.id] === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected((s) => ({ ...s, [opt.id]: v.id }))}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-brand/40 hover:text-brand",
                  )}
                >
                  {v.label}
                  {v.priceDelta ? <span className="ml-1 opacity-70">+{formatPrice(v.priceDelta)}</span> : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex items-center gap-4">
        <QuantityStepper value={qty} onChange={setQty} max={20} />
        <Button size="lg" onClick={add} className="flex-1">
          Add to order · {formatPrice(unitPrice * qty)}
        </Button>
      </div>
    </div>
  );
}
