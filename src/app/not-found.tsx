import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">This table’s not set</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We couldn’t find that page. It may have moved, or never existed — but the coffee’s still on.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/">Back home</Link></Button>
        <Button asChild variant="outline"><Link href="/menu">Browse the menu</Link></Button>
      </div>
    </Container>
  );
}
