"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Clock, Users, MapPin, Phone } from "lucide-react";
import { reservationSchema } from "@/lib/validation/reservation";
import { reservationService, ReservationError } from "@/services/reservation";
import { SITE } from "@/lib/site";
import { formatTime, formatLongDate } from "@/lib/format";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
const OCCASIONS = ["Just because", "Birthday", "Anniversary", "Date night", "Business", "Celebration"];

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function maxIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Field({
  label, name, value, onChange, errors, type = "text", placeholder, autoComplete, className,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  errors: Record<string, string>; type?: string; placeholder?: string; autoComplete?: string; className?: string;
}) {
  const error = errors[name];
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ReserveView() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [timeSlot, setTimeSlot] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const minDate = useMemo(() => todayIso(), []);
  const maxDate = useMemo(() => maxIso(), []);

  // Default to today on mount (client-only, avoids SSR hydration mismatch).
  useEffect(() => {
    setDate(todayIso());
  }, []);

  // Load bookable slots whenever the date changes.
  useEffect(() => {
    if (!date) return;
    let active = true;
    setSlotsLoading(true);
    reservationService.slots(date).then((s) => {
      if (!active) return;
      setSlots(s);
      setTimeSlot((prev) => (s.includes(prev) ? prev : ""));
      setSlotsLoading(false);
    });
    return () => { active = false; };
  }, [date]);

  async function book() {
    const data = { date, timeSlot, partySize, ...contact, occasion: occasion === OCCASIONS[0] ? undefined : occasion, notes: notes.trim() || undefined };
    const parsed = reservationSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const reservation = await reservationService.create(parsed.data);
      router.push(`/reserve/confirmed?id=${reservation.id}`);
    } catch (err) {
      setPending(false);
      toast.error(err instanceof ReservationError ? err.message : "Could not book that table. Please try again.");
    }
  }

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Book a table</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Reserve at Café Dolitó</h1>
        <p className="mt-3 text-muted-foreground">
          Save your seat for slow coffee and a table set between Italy and India. We hold reservations for 15 minutes past your time.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {/* date + party */}
          <section>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <CalendarDays className="size-5 text-brand" /> Date &amp; party
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="date" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={minDate}
                  max={maxDate}
                  aria-invalid={!!errors.date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="partySize" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Guests</label>
                <select
                  id="partySize"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PARTY_SIZES.map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
                </select>
                <p className="text-xs text-muted-foreground">Parties over 12? <a href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`} className="text-brand hover:underline">Call us</a>.</p>
              </div>
            </div>
          </section>

          {/* time */}
          <section>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Clock className="size-5 text-brand" /> Time
            </h2>
            {slotsLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Finding open tables…</p>
            ) : slots.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No tables for this date — try another day.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Available times">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTimeSlot(s)}
                    aria-pressed={timeSlot === s}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      timeSlot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-brand/40 hover:text-brand",
                    )}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </div>
            )}
            {errors.timeSlot && <p className="mt-2 text-xs text-destructive">{errors.timeSlot}</p>}
          </section>

          {/* details */}
          <section>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Users className="size-5 text-brand" /> Your details
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} errors={errors} autoComplete="name" className="sm:col-span-2" />
              <Field label="Email" name="email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} errors={errors} autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} errors={errors} autoComplete="tel" />
              <div className="space-y-1.5">
                <label htmlFor="occasion" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Occasion</label>
                <select
                  id="occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="notes" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Allergies, a high chair, a quiet corner…"
                  aria-invalid={!!errors.notes}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
              </div>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold text-foreground">Your reservation</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-right font-medium text-foreground">{date ? formatLongDate(date) : "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-medium text-foreground">{timeSlot ? formatTime(timeSlot) : "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Party</dt>
              <dd className="font-medium text-foreground">{partySize} {partySize === 1 ? "guest" : "guests"}</dd>
            </div>
          </dl>

          <Button size="lg" className="w-full" disabled={pending} onClick={book}>
            {pending ? "Booking…" : "Confirm reservation"}
          </Button>

          <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-3.5 shrink-0 text-brand" /> {SITE.address.line1}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}</p>
            <p className="flex items-start gap-2"><Phone className="mt-0.5 size-3.5 shrink-0 text-brand" /> {SITE.phone}</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
