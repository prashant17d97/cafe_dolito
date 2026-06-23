import { describe, expect, it } from "vitest";
import { isOpenNow, generateSlots } from "./hours";
import type { Hours } from "@/types";

const HOURS: Hours = Array.from({ length: 7 }, () => ({ open: "07:00", close: "22:00" }));

describe("hours.isOpenNow", () => {
  it("open during hours", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T15:00:00"))).toBe(true); });
  it("closed before open", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T06:30:00"))).toBe(false); });
  it("closed after close", () => { expect(isOpenNow(HOURS, new Date("2026-06-23T22:30:00"))).toBe(false); });
  it("closed when day is null", () => {
    const h: Hours = HOURS.map((d, i) => (i === 1 ? null : d));
    expect(isOpenNow(h, new Date("2026-06-22T12:00:00"))).toBe(false); // Mon
  });
  it("is closed exactly at close and open exactly at open", () => {
    expect(isOpenNow(HOURS, new Date("2026-06-23T22:00:00"))).toBe(false);
    expect(isOpenNow(HOURS, new Date("2026-06-23T07:00:00"))).toBe(true);
  });
});

describe("hours.generateSlots", () => {
  it("generates 30-min slots within hours", () => {
    const slots = generateSlots(HOURS, new Date("2026-06-23T00:00:00"), 30);
    expect(slots[0]).toBe("07:00");
    expect(slots).toContain("12:30");
    expect(slots.at(-1)).toBe("21:30"); // last seating before 22:00 close
  });
  it("returns [] for a closed day", () => {
    const h: Hours = HOURS.map(() => null);
    expect(generateSlots(h, new Date("2026-06-23T00:00:00"), 30)).toEqual([]);
  });
});
