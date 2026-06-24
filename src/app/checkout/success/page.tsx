import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessView } from "@/components/checkout/success-view";

export const metadata: Metadata = { title: "Order confirmed" };

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading…</div>}>
      <SuccessView />
    </Suspense>
  );
}
