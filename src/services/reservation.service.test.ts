import { describe, expect, it, beforeEach } from "vitest";
import { reservationService } from "./reservation";

describe("reservationService", () => {
  beforeEach(() => localStorage.clear());
  it("returns bookable slots for a date", async () => {
    const slots = await reservationService.slots("2026-06-23");
    expect(slots[0]).toMatch(/^\d{2}:\d{2}$/);
    expect(slots.length).toBeGreaterThan(0);
  });
  it("creates a reservation with a reference and confirmed status", async () => {
    const r = await reservationService.create({
      date: "2026-06-23", timeSlot: "19:00", partySize: 2,
      name: "Demo", email: "d@e.com", phone: "5550142",
    });
    expect(r.reference).toMatch(/^CD-R-/);
    expect(r.status).toBe("confirmed");
    expect((await reservationService.list()).length).toBe(1);
  });
  it("cancels a reservation", async () => {
    const r = await reservationService.create({ date: "2026-06-23", timeSlot: "19:00", partySize: 2, name: "D", email: "d@e.com", phone: "1" });
    await reservationService.cancel(r.id);
    expect((await reservationService.list())[0].status).toBe("cancelled");
  });
});
