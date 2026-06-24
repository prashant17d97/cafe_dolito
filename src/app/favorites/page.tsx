import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { FavoritesGrid } from "@/components/account/favorites-grid";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Saved by you</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">Favorites</h1>
        <p className="mt-3 text-muted-foreground">Everything you’ve tapped the heart on, ready to add to your next order.</p>
      </header>
      <div className="mt-10">
        <FavoritesGrid />
      </div>
    </Container>
  );
}
