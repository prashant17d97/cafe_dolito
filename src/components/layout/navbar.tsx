"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";

import { MAIN_NAV } from "@/lib/site";
import { isActivePath } from "@/lib/navigation";
import { useUiStore } from "@/store/ui.store";
import { useCartStore, selectCartCount } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { AccountMenu } from "./account-menu";

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const count = useCartStore(selectCartCount);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cart is only offered to signed-in guests. Until hydrated we match the
  // server (logged-out) to avoid a mismatch, then reveal it for members.
  const loggedIn = mounted && !!user;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" aria-label="Café Dolitó home" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Center: Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {MAIN_NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm transition-colors",
                  isActivePath(pathname, href)
                    ? "text-brand font-medium"
                    : "text-foreground/80 hover:text-brand"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Icon buttons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              className="min-h-[44px] min-w-[44px]"
              onClick={() => useUiStore.getState().setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>

            {/* Account */}
            <AccountMenu />

            {/* Cart — members only */}
            {loggedIn && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open cart"
                className="relative min-h-[44px] min-w-[44px]"
                onClick={() => useUiStore.getState().setCartOpen(true)}
              >
                <ShoppingBag className="size-5" />
                {count > 0 && (
                  <span
                    key={count}
                    className="animate-badge-bounce absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Button>
            )}

            {/* Mobile nav trigger */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
