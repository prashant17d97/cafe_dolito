"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, Clock, Users } from "lucide-react";
import type { Reservation } from "@/types";
import { reservationService } from "@/services/reservation";
import { formatTime, formatLongDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Reservation["status"], string> = {
  confirmed: "bg-basil/15 text-basil",
  seated: "bg-primary/15 text-brand",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    reservationService.list().then((r) => {
      if (active) {
        setReservations(r);
        setLoaded(true);
      }
    });
    return () => { active = false; };
  }, []);

  async function cancel(id: string) {
    setCancelling(id);
    try {
      await reservationService.cancel(id);
      setReservations((rs) => rs.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
      toast.success("Reservation cancelled.");
    } catch {
      toast.error("Could not cancel — please try again.");
    } finally {
      setCancelling(null);
    }
  }

  if (!loaded) {
    return <p className="py-16 text-center text-muted-foreground">Loading your reservations…</p>;
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="text-muted-foreground">You have no reservations yet.</p>
        <Button asChild className="mt-5"><Link href="/reserve">Reserve a table</Link></Button>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reservations.map((r) => (
        <li key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-foreground">{r.reference}</span>
              <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider capitalize", STATUS_STYLES[r.status])}>
                {r.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-brand" /> {formatLongDate(r.date)}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4 text-brand" /> {formatTime(r.timeSlot)}</span>
              <span className="flex items-center gap-1.5"><Users className="size-4 text-brand" /> {r.partySize} {r.partySize === 1 ? "guest" : "guests"}</span>
            </div>
            {r.occasion && <p className="text-sm text-muted-foreground">Occasion: {r.occasion}</p>}
          </div>
          {(r.status === "confirmed" || r.status === "seated") && (
            <Button
              variant="outline"
              className="mt-4 shrink-0 sm:mt-0"
              disabled={cancelling === r.id}
              onClick={() => cancel(r.id)}
            >
              {cancelling === r.id ? "Cancelling…" : "Cancel"}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
