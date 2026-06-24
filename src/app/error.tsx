"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In a real app this would report to an error service.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-brand">Something spilled</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">A little kitchen mishap</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Something went wrong on our end. Try again, or head back to safer ground.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline"><Link href="/">Back home</Link></Button>
      </div>
    </Container>
  );
}
