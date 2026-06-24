import { HeroParallax } from "@/components/home/hero-parallax";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Task 6: layered-parallax hero — temporary mount; final composition in Task 12 */}
      <HeroParallax />

      {/* Placeholder — retained for subsequent tasks */}
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">Café Dolitó</p>
        <p className="max-w-md text-muted-foreground">
          Foundation online. Landing page and menu arrive in the next phases.
        </p>
        <span className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Coffee · Italian · Indian · Fusion
        </span>
      </div>
    </main>
  );
}
