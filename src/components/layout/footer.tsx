"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { SITE, FOOTER_LINKS } from "@/lib/site";
import { isOpenNow } from "@/lib/hours";
import { Container } from "@/components/common/container";
import { Logo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getTodayHoursLabel(now: Date): string {
  const day = SITE.hours[now.getDay()];
  if (!day) return "";
  const fmt = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return m === 0 ? `${hour}${ampm}` : `${hour}:${String(m).padStart(2, "0")}${ampm}`;
  };
  return `${fmt(day.open)} – ${fmt(day.close)}`;
}

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const now = new Date();
  const open = mounted ? isOpenNow(SITE.hours, now) : null;

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("You're on the list — see you at the counter.");
    setEmail("");
  }

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <Container className="py-12">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo className="text-secondary-foreground [&_span]:text-secondary-foreground" />

            <p className="text-sm leading-relaxed text-secondary-foreground/80 max-w-xs">
              {SITE.tagline} — a warm corner where Italian craft meets Indian soul.
            </p>

            {/* Open-now pill */}
            <div className="flex items-center gap-2 text-sm">
              {mounted === false ? (
                /* Pre-mount neutral label — avoids hydration mismatch */
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/20 px-3 py-1 text-xs font-medium text-secondary-foreground/60">
                  <span className="size-2 rounded-full bg-secondary-foreground/30" />
                  Hours
                </span>
              ) : open ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-basil/40 bg-basil/10 px-3 py-1 text-xs font-medium text-basil">
                  <span className="size-2 rounded-full bg-basil" />
                  Open now · {getTodayHoursLabel(now)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/20 px-3 py-1 text-xs font-medium text-secondary-foreground/60">
                  <span className="size-2 rounded-full bg-secondary-foreground/30" />
                  Closed · {getTodayHoursLabel(now)}
                </span>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-1 mt-1">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Café Dolitó on Instagram"
                className={cn(
                  "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md",
                  "text-secondary-foreground/70 transition-colors hover:text-secondary-foreground",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                )}
              >
                {/* Instagram icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={SITE.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Café Dolitó on Facebook"
                className={cn(
                  "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md",
                  "text-secondary-foreground/70 transition-colors hover:text-secondary-foreground",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                )}
              >
                {/* Facebook icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([heading, links]) => (
              <div key={heading} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/50">
                  {heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-secondary-foreground/80 transition-colors hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* Newsletter */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/50">
              Stay in the loop
            </h3>
            <p className="text-sm text-secondary-foreground/70">
              New menus, seasonal specials, and events — no noise.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 focus-visible:ring-secondary-foreground/50"
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground min-h-[44px]"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-secondary-foreground/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-secondary-foreground/50">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <address className="not-italic">
            {SITE.address.line1}, {SITE.address.city}, {SITE.address.state}{" "}
            {SITE.address.zip}
          </address>
        </div>
      </Container>
    </footer>
  );
}
