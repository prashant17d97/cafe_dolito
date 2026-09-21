"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Fulfillment } from "@/types";
import { useCart } from "@/features/use-cart";
import { calcTotals, PROMO_CODES, TIP_PRESETS } from "@/lib/pricing";
import { contactSchema, addressSchema, paymentSchema } from "@/lib/validation/checkout";
import { formatCardNumber, formatExpiry, formatName, formatPhone } from "@/lib/validation/patterns";
import { orderService } from "@/services/order";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PICKUP_SLOTS = ["As soon as possible (~20 min)", "In 30 minutes", "In 45 minutes", "In 1 hour"];

const LABEL = "block font-mono text-xs uppercase tracking-wider text-muted-foreground";

function Field({
  label, name, value, onChange, onBlur, errors, type = "text", placeholder, autoComplete, inputMode, maxLength, className,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; onBlur?: () => void;
  errors: Record<string, string>; type?: string; placeholder?: string; autoComplete?: string;
  inputMode?: React.ComponentProps<"input">["inputMode"]; maxLength?: number; className?: string;
}) {
  const error = errors[name];
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className={LABEL}>{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode ?? (type === "tel" ? "tel" : type === "email" ? "email" : undefined)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <p id={`${name}-error`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

type Schema = typeof contactSchema | typeof addressSchema | typeof paymentSchema;

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [slot, setSlot] = useState(PICKUP_SLOTS[0]);
  const [tipPct, setTipPct] = useState(0.15);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "" });
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const totals = calcTotals({ items, fulfillment, tip: subtotal * tipPct, promoCode: appliedPromo ?? undefined });

  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Your order is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something from the menu before checking out.</p>
        <Button asChild className="mt-6"><Link href="/menu">Browse the menu</Link></Button>
      </Container>
    );
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      toast.success(`Promo ${code} applied`);
    } else {
      toast.error("That promo code is not valid.");
    }
  }

  function collect(schema: Schema, data: unknown, errs: Record<string, string>) {
    const r = schema.safeParse(data);
    if (!r.success) for (const issue of r.error.issues) errs[String(issue.path[0])] = issue.message;
  }

  /** Validate one field on blur; sets or clears just that field's error. */
  function blur(schema: Schema, data: unknown, name: string) {
    const errs: Record<string, string> = {};
    collect(schema, data, errs);
    setErrors((e) => {
      const next = { ...e };
      if (errs[name]) next[name] = errs[name]; else delete next[name];
      return next;
    });
  }

  async function placeOrder() {
    const errs: Record<string, string> = {};
    collect(contactSchema, contact, errs);
    if (fulfillment === "delivery") collect(addressSchema, address, errs);
    collect(paymentSchema, payment, errs);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setPending(true);
    try {
      const order = await orderService.create({
        items,
        fulfillment,
        slot: fulfillment === "pickup" ? slot : undefined,
        address: fulfillment === "delivery" ? address : undefined,
        contact,
        tip: totals.tip,
        promoCode: appliedPromo ?? undefined,
      });
      clear();
      router.push(`/checkout/success?order=${order.id}`);
    } catch {
      setPending(false);
      toast.error("Something went wrong placing your order. Please try again.");
    }
  }

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* form */}
        <div className="space-y-10">
          {/* fulfillment */}
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">How would you like it?</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(["pickup", "delivery"] as Fulfillment[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFulfillment(f)}
                  aria-pressed={fulfillment === f}
                  className={cn(
                    "focus-ring rounded-xl border px-4 py-3 text-left capitalize transition-colors",
                    fulfillment === f ? "border-primary bg-accent/50" : "border-border bg-card hover:border-brand/40",
                  )}
                >
                  <span className="font-medium text-foreground">{f}</span>
                  <span className="block text-xs text-muted-foreground">
                    {f === "pickup" ? "Collect at 27 Almond Row" : `Delivered · ${formatPrice(totals.deliveryFee)} (free over ${formatPrice(40)})`}
                  </span>
                </button>
              ))}
            </div>
            {fulfillment === "pickup" && (
              <div className="mt-4 space-y-1.5">
                <label htmlFor="slot" className={LABEL}>Pickup time</label>
                <select
                  id="slot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-72 md:text-sm"
                >
                  {PICKUP_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </section>

          {/* contact */}
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Your details</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: formatName(v) }))} onBlur={() => blur(contactSchema, contact, "name")} errors={errors} autoComplete="name" className="sm:col-span-2" />
              <Field label="Email" name="email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} onBlur={() => blur(contactSchema, contact, "email")} errors={errors} autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: formatPhone(v) }))} onBlur={() => blur(contactSchema, contact, "phone")} errors={errors} autoComplete="tel" />
            </div>
          </section>

          {/* delivery address */}
          {fulfillment === "delivery" && (
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground">Delivery address</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Address" name="line1" value={address.line1} onChange={(v) => setAddress((a) => ({ ...a, line1: v }))} onBlur={() => blur(addressSchema, address, "line1")} errors={errors} autoComplete="address-line1" className="sm:col-span-2" />
                <Field label="Apt, suite (optional)" name="line2" value={address.line2} onChange={(v) => setAddress((a) => ({ ...a, line2: v }))} onBlur={() => blur(addressSchema, address, "line2")} errors={errors} className="sm:col-span-2" />
                <Field label="City" name="city" value={address.city} onChange={(v) => setAddress((a) => ({ ...a, city: v }))} onBlur={() => blur(addressSchema, address, "city")} errors={errors} autoComplete="address-level2" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="State" name="state" value={address.state} onChange={(v) => setAddress((a) => ({ ...a, state: v }))} onBlur={() => blur(addressSchema, address, "state")} errors={errors} autoComplete="address-level1" />
                  <Field label="ZIP" name="zip" value={address.zip} onChange={(v) => setAddress((a) => ({ ...a, zip: v }))} onBlur={() => blur(addressSchema, address, "zip")} errors={errors} inputMode="numeric" autoComplete="postal-code" />
                </div>
              </div>
            </section>
          )}

          {/* payment */}
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Payment</h2>
            <p className="mt-1 text-xs text-muted-foreground">Demo only — no real card is charged or stored.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Name on card" name="cardName" value={payment.cardName} onChange={(v) => setPayment((p) => ({ ...p, cardName: formatName(v) }))} onBlur={() => blur(paymentSchema, payment, "cardName")} errors={errors} className="sm:col-span-2" />
              <Field label="Card number" name="cardNumber" value={payment.cardNumber} onChange={(v) => setPayment((p) => ({ ...p, cardNumber: formatCardNumber(v) }))} onBlur={() => blur(paymentSchema, payment, "cardNumber")} errors={errors} maxLength={23} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
              <Field label="Expiry (MM/YY)" name="expiry" value={payment.expiry} onChange={(v) => setPayment((p) => ({ ...p, expiry: formatExpiry(v) }))} onBlur={() => blur(paymentSchema, payment, "expiry")} errors={errors} maxLength={5} inputMode="numeric" autoComplete="cc-exp" placeholder="08/27" />
              <Field label="CVC" name="cvc" value={payment.cvc} onChange={(v) => setPayment((p) => ({ ...p, cvc: v.replace(/\D/g, "").slice(0, 4) }))} onBlur={() => blur(paymentSchema, payment, "cvc")} errors={errors} maxLength={4} inputMode="numeric" autoComplete="cc-csc" placeholder="123" />
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold text-foreground">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{i.quantity}× {i.name}</span>
                <span className="font-mono text-foreground">{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>

          {/* tip */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Tip the kitchen</p>
            <div className="mt-2 flex gap-2">
              {[...TIP_PRESETS, 0].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTipPct(p)}
                  aria-pressed={tipPct === p}
                  className={cn(
                    "focus-ring flex-1 rounded-full border py-1.5 text-sm transition-colors",
                    tipPct === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-brand/40",
                  )}
                >
                  {p === 0 ? "None" : `${Math.round(p * 100)}%`}
                </button>
              ))}
            </div>
          </div>

          {/* promo */}
          <div className="flex gap-2">
            <Input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo code" aria-label="Promo code" className="h-10" />
            <Button type="button" variant="outline" onClick={applyPromo} className="h-10">Apply</Button>
          </div>

          <div className="space-y-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
            {totals.discount > 0 && <Row label={`Discount (${appliedPromo})`} value={`−${formatPrice(totals.discount)}`} accent />}
            {fulfillment === "delivery" && <Row label="Delivery" value={totals.deliveryFee === 0 ? "Free" : formatPrice(totals.deliveryFee)} />}
            <Row label="Tax" value={formatPrice(totals.tax)} />
            {totals.tip > 0 && <Row label="Tip" value={formatPrice(totals.tip)} />}
            <div className="flex justify-between pt-2 text-base font-semibold text-foreground">
              <span>Total</span>
              <span className="font-mono">{formatPrice(totals.total)}</span>
            </div>
          </div>

          <Button size="lg" className="w-full" disabled={pending} onClick={placeOrder}>
            {pending ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
          </Button>
        </aside>
      </div>
    </Container>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-mono", accent ? "text-basil" : "text-foreground")}>{value}</span>
    </div>
  );
}
