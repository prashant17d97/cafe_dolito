import { CountUp } from "@/components/common/count-up";

interface Stat {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { end: 12, label: "single-origin farms" },
  { end: 3, label: "cuisines, one kitchen" },
  { end: 2400, suffix: "+", label: "cups poured a week" },
  { end: 7, label: "days, from 7am" },
];

export function StatCounters() {
  return (
    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="space-y-1">
          <dd className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
          </dd>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
