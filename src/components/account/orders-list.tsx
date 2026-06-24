"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/types";
import { orderService } from "@/services/order";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Order["status"], string> = {
  received: "bg-basil/15 text-basil",
  preparing: "bg-primary/15 text-brand",
  ready: "bg-marigold/20 text-brand",
  completed: "bg-muted text-muted-foreground",
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    orderService.list().then((o) => {
      if (active) { setOrders(o); setLoaded(true); }
    });
    return () => { active = false; };
  }, []);

  if (!loaded) return <p className="py-16 text-center text-muted-foreground">Loading your orders…</p>;

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="text-muted-foreground">You haven’t placed an order yet.</p>
        <Button asChild className="mt-5"><Link href="/menu">Browse the menu</Link></Button>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-foreground">{o.code}</span>
              <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider capitalize", STATUS_STYLES[o.status])}>
                {o.status}
              </span>
              <span className="text-sm capitalize text-muted-foreground">· {o.fulfillment}</span>
            </div>
            <span className="font-mono text-sm font-semibold text-foreground">{formatPrice(o.totals.total)}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {o.items.map((i) => (
              <li key={i.key}>{i.quantity}× {i.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
