import type { Hours } from "@/types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(hours: Hours, now: Date): boolean {
  const day = hours[now.getDay()];
  if (!day) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= toMinutes(day.open) && mins < toMinutes(day.close);
}

/** Bookable start times for `date`, last slot one step before close. */
export function generateSlots(hours: Hours, date: Date, stepMins = 30): string[] {
  const day = hours[date.getDay()];
  if (!day) return [];
  const start = toMinutes(day.open);
  const end = toMinutes(day.close);
  const slots: string[] = [];
  for (let t = start; t <= end - stepMins; t += stepMins) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}
