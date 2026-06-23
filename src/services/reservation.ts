import type { Reservation } from "@/types";
import { SITE } from "@/lib/site";
import { generateSlots } from "@/lib/hours";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:reservations";

interface CreateReservationInput {
  date: string; timeSlot: string; partySize: number;
  name: string; email: string; phone: string; occasion?: string; notes?: string;
}

export const reservationService = {
  async slots(dateIso: string): Promise<string[]> {
    return withDelay(generateSlots(SITE.hours, new Date(`${dateIso}T00:00:00`), 30));
  },
  async create(input: CreateReservationInput): Promise<Reservation> {
    const all = readJSON<Reservation[]>(KEY, []);
    const n = 501 + all.length;
    const reservation: Reservation = {
      id: `r-${n}`,
      reference: `CD-R-${n}`,
      ...input,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    writeJSON(KEY, [reservation, ...all]);
    return withDelay(reservation, 300);
  },
  async list(): Promise<Reservation[]> { return withDelay(readJSON<Reservation[]>(KEY, [])); },
  async cancel(id: string): Promise<void> {
    const all = readJSON<Reservation[]>(KEY, []).map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r));
    writeJSON(KEY, all);
    return withDelay(undefined);
  },
};
