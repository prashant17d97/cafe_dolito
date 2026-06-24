"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Order } from "@/types";
import { orderService } from "@/services/order";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export function SuccessView() {
  const sp = useSearchParams();
  const id = sp.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id) {
      setLoaded(true);
      return;
    }
    orderService.get(id).then((o) => {
      if (active) {
        setOrder(o ?? null);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  const firstName = order?.contact.name?.split(" ")[0];

  return (
    <Container className="py-20 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-basil/15 text-basil">
        <Check className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold text-foreground">Order confirmed</h1>

      {order ? (
        <>
          <p className="mt-2 text-muted-foreground">
            Thanks{firstName ? `, ${firstName}` : ""} — we are firing up the kitchen.
          </p>
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">Order</span>
              <span className="font-mono font-semibold text-foreground">{order.code}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">
                {order.fulfillment === "pickup" ? "Pickup" : "Delivery"}
              </span>
              <span className="text-sm text-foreground">
                {order.fulfillment === "pickup" ? order.slot : "On its way to you"}
              </span>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              {order.items.map((i) => (
                <li key={i.key} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{i.quantity}× {i.name}</span>
                  <span className="font-mono text-foreground">{formatPrice(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold text-foreground">
              <span>Total</span>
              <span className="font-mono">{formatPrice(order.totals.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-muted-foreground">{loaded ? "Your order has been placed." : "Loading your order…"}</p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/menu">Order more</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">View orders</Link>
        </Button>
      </div>
    </Container>
  );
}
