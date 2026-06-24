"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, CalendarDays, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

const TILES = [
  { href: "/account/orders", label: "Orders", desc: "Track and revisit what you’ve ordered.", icon: ShoppingBag },
  { href: "/account/reservations", label: "Reservations", desc: "View or cancel your upcoming tables.", icon: CalendarDays },
  { href: "/favorites", label: "Favorites", desc: "The dishes and drinks you’ve saved.", icon: Heart },
];

export function AccountDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <Container className="py-24 text-center text-muted-foreground">Loading…</Container>;
  }

  if (!user) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Your account</h1>
        <p className="mt-2 text-muted-foreground">Sign in to see your orders and reservations.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link href="/login?redirect=/account">Sign in</Link></Button>
          <Button asChild variant="outline"><Link href="/register">Create account</Link></Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Account</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Hello, {user.firstName}</h1>
          <p className="mt-2 text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); router.push("/"); }}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-brand/40">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent/60 text-brand">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-brand opacity-0 transition-opacity group-hover:opacity-100">View →</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
