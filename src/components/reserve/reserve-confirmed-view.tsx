"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, CalendarDays, Clock, Users } from "lucide-react";
import type { Reservation } from "@/types";
import { reservationService } from "@/services/reservation";
import { formatTime, formatLongDate } from "@/lib/format";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export function ReserveConfirmedView() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id) {
      setLoaded(true);
      return;
    }
    reservationService.get(id).then((r) => {
      if (active) {
        setReservation(r);
        setLoaded(true);
      }
    });
    return () => { active = false; };
  }, [id]);

  const firstName = reservation?.name?.split(" ")[0];

  return (
    <Container className="py-20 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-basil/15 text-basil">
        <Check className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold text-foreground">Table reserved</h1>

      {reservation ? (
        <>
          <p className="mt-2 text-muted-foreground">
            See you soon{firstName ? `, ${firstName}` : ""} — a confirmation is on its way to {reservation.email}.
          </p>
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">Reference</span>
              <span className="font-mono font-semibold text-foreground">{reservation.reference}</span>
            </div>
            <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-brand" />
                <dd className="text-foreground">{formatLongDate(reservation.date)}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-brand" />
                <dd className="text-foreground">{formatTime(reservation.timeSlot)}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-4 text-brand" />
                <dd className="text-foreground">{reservation.partySize} {reservation.partySize === 1 ? "guest" : "guests"}{reservation.occasion ? ` · ${reservation.occasion}` : ""}</dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        <p className="mt-2 text-muted-foreground">{loaded ? "We couldn’t find that reservation." : "Loading your reservation…"}</p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/account/reservations">My reservations</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/menu">Browse the menu</Link>
        </Button>
      </div>
    </Container>
  );
}
