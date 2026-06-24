"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/common/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    // Mock subscribe — no backend.
    setTimeout(() => {
      toast.success("You're on the list — we'll send the seasonal drops.");
      setEmail("");
      setPending(false);
    }, 400);
  }

  return (
    <section className="bg-muted py-16 sm:py-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Get the seasonal drop</p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          New roasts &amp; fusion specials, first
        </h2>
        <p className="mt-3 text-muted-foreground">
          One email a month. Seasonal menus, roastery news, the occasional secret dish.
        </p>
        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-11 flex-1 bg-background"
          />
          <Button type="submit" size="lg" disabled={pending} className="h-11">
            {pending ? "Joining…" : "Join the list"}
          </Button>
        </form>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
      </Container>
    </section>
  );
}
