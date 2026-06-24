"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { toast } from "sonner";

import { MAIN_NAV } from "@/lib/site";
import { isActivePath } from "@/lib/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const itemClass = (active: boolean) =>
  cn(
    "flex min-h-[44px] items-center rounded-md px-3 text-sm transition-colors",
    active ? "bg-muted text-brand font-medium" : "text-foreground/80 hover:bg-muted hover:text-brand",
  );

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const loggedIn = mounted && !!user;

  function handleNavigate() {
    setOpen(false);
  }

  function signOut() {
    logout();
    toast.success("Signed out.");
    setOpen(false);
    router.push("/");
  }

  const accountLinks = loggedIn
    ? [
        { label: "Account", href: "/account" },
        { label: "Orders", href: "/account/orders" },
        { label: "Reservations", href: "/account/reservations" },
        { label: "Favorites", href: "/favorites" },
      ]
    : [
        { label: "Sign in", href: "/login" },
        { label: "Create account", href: "/register" },
      ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="min-h-[44px] min-w-[44px]"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle asChild>
            <Link href="/" onClick={handleNavigate} aria-label="Café Dolitó home">
              <Logo />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-4">
          {MAIN_NAV.map(({ label, href }) => (
            <Link key={href} href={href} onClick={handleNavigate} className={itemClass(isActivePath(pathname, href))}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-4 py-4">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {loggedIn ? `Hi, ${user!.firstName}` : "Account"}
          </p>
          <div className="flex flex-col gap-1">
            {accountLinks.map(({ label, href }) => (
              <Link key={href} href={href} onClick={handleNavigate} className={itemClass(isActivePath(pathname, href))}>
                {label}
              </Link>
            ))}
            {loggedIn && (
              <button type="button" onClick={signOut} className="focus-ring flex min-h-[44px] items-center rounded-md px-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
                Sign out
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
