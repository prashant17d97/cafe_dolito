import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { OrdersList } from "@/components/account/orders-list";

export const metadata: Metadata = { title: "My orders" };

export default function AccountOrdersPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Account</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">My orders</h1>
        </div>
        <Button asChild variant="outline"><Link href="/menu">Order again</Link></Button>
      </header>
      <div className="mt-10">
        <OrdersList />
      </div>
    </Container>
  );
}
