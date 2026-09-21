// ---------------------------------------------------------------------------
// Inline SVG motifs — NO photo crops (they look bad cut out)
// ---------------------------------------------------------------------------

/** Italian: basil leaf */
export function BasilLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M24 2C14 12 6 24 8 40c2 12 10 20 16 22C30 60 38 52 40 40c2-16-6-28-16-38z" />
      <line
        x1="24"
        y1="62"
        x2="24"
        y2="30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 44 C18 40 14 34 16 30M24 44 C30 40 34 34 32 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

/** Indian: marigold bloom */
export function Marigold({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <ellipse
          key={deg}
          cx="30"
          cy="30"
          rx="5"
          ry="14"
          transform={`rotate(${deg} 30 30)`}
          opacity="0.8"
        />
      ))}
      <circle cx="30" cy="30" r="6" />
    </svg>
  );
}
