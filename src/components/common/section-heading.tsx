import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn("space-y-3", isCenter && "text-center")}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className={cn(isCenter && "flex justify-center")}>{action}</div>}
    </div>
  );
}
