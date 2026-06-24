const ITEMS = [
  "Single-origin roastery",
  "Wood-fired Napoletana",
  "Tandoor & biryani",
  "Oat-first, always",
  "Open 7am daily",
  "The Fusion Table",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="flex items-center gap-4 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.2em]"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-caramel/80" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Infinitely scrolling trust strip (two identical rows; CSS shifts one row width). */
export function TrustMarquee() {
  return (
    <section
      aria-label="What we're about"
      className="overflow-hidden border-y border-border bg-secondary py-3.5 text-secondary-foreground"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
