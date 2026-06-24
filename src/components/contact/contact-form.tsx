"use client";

import { useState } from "react";
import { toast } from "sonner";
import { contactFormSchema } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  function set(key: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setPending(true);
    // Demo only — no message is actually sent.
    await new Promise((r) => setTimeout(r, 500));
    setPending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Thanks — we’ll be in touch soon.");
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="font-display text-xl font-semibold text-foreground">Message received</h2>
        <p className="mt-2 text-sm text-muted-foreground">Thanks for reaching out. We’ll reply by email shortly.</p>
        <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>Send another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" name="name" value={form.name} error={errors.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={(v) => set("email", v)} autoComplete="email" />
      </div>
      <FormField label="Subject" name="subject" value={form.subject} error={errors.subject} onChange={(v) => set("subject", v)} />
      <div className="space-y-1.5">
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Message</label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={5}
          maxLength={1000}
          aria-invalid={!!errors.message}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>
    </form>
  );
}

function FormField({
  label, name, value, onChange, error, type = "text", autoComplete,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <Input id={name} name={name} type={type} value={value} autoComplete={autoComplete} inputMode={type === "email" ? "email" : type === "tel" ? "tel" : undefined} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
