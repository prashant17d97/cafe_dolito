"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { isOpenNow } from "@/lib/hours";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function VisitHours() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); }, []);

  const today = now?.getDay();
  const open = now ? isOpenNow(SITE.hours, now) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Opening hours</h2>
        {open !== null && (
          <span className={cn("flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider", open ? "text-basil" : "text-muted-foreground")}>
            <span className={cn("size-2 rounded-full", open ? "bg-basil" : "bg-muted-foreground")} />
            {open ? "Open now" : "Closed"}
          </span>
        )}
      </div>
      <dl className="mt-4 divide-y divide-border text-sm">
        {SITE.hours.map((h, i) => (
          <div key={DAYS[i]} className={cn("flex items-center justify-between py-2", i === today && "font-medium text-foreground")}>
            <dt className={cn(i === today ? "text-foreground" : "text-muted-foreground")}>{DAYS[i]}</dt>
            <dd className={cn("font-mono", i === today ? "text-foreground" : "text-muted-foreground")}>
              {h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : "Closed"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
