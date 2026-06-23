import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* Coffee cup roundel — uses currentColor so it inherits text colour */}
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 shrink-0"
      >
        {/* Cup body */}
        <path
          d="M7 11h18l-2 10a3 3 0 0 1-3 2.5h-8A3 3 0 0 1 9 21L7 11Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Handle */}
        <path
          d="M21 14h2a3 3 0 0 1 0 6h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Saucer */}
        <path
          d="M5 24.5h22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Steam — left */}
        <path
          d="M12 9c0-1 1-1.5 1-2.5S12 5 12 4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        {/* Steam — right */}
        <path
          d="M17 9c0-1 1-1.5 1-2.5S17 5 17 4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>

      {withWordmark && (
        <span className="font-display text-xl leading-none tracking-tight text-brand">
          Café Dolitó
        </span>
      )}
    </span>
  );
}
