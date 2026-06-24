import type { Metadata } from "next";
import { ReserveView } from "@/components/reserve/reserve-view";

export const metadata: Metadata = {
  title: "Reserve a table",
  description: "Book a table at Café Dolitó — slow coffee and a kitchen set between Italy and India.",
};

export default function ReservePage() {
  return <ReserveView />;
}
