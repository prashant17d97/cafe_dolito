import type { Metadata } from "next";
import { Suspense } from "react";
import { ReserveConfirmedView } from "@/components/reserve/reserve-confirmed-view";

export const metadata: Metadata = { title: "Reservation confirmed" };

export default function ReserveConfirmedPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading…</div>}>
      <ReserveConfirmedView />
    </Suspense>
  );
}
