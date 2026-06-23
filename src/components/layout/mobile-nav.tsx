"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { MAIN_NAV } from "@/lib/site";
import { isActivePath } from "@/lib/navigation";
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

const QUICK_LINKS = [
  { label: "Reserve a Table", href: "/reserve" },
  { label: "Account", href: "/account" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function handleNavigate() {
    setOpen(false);
  }

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
            <Link
              key={href}
              href={href}
              onClick={handleNavigate}
              className={cn(
                "flex min-h-[44px] items-center rounded-md px-3 text-sm transition-colors",
                isActivePath(pathname, href)
                  ? "bg-muted text-brand font-medium"
                  : "text-foreground/80 hover:bg-muted hover:text-brand"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {QUICK_LINKS.length > 0 && (
          <div className="border-t border-border px-4 py-4">
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick links
            </p>
            <div className="flex flex-col gap-1">
              {QUICK_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleNavigate}
                  className={cn(
                    "flex min-h-[44px] items-center rounded-md px-3 text-sm transition-colors",
                    isActivePath(pathname, href)
                      ? "bg-muted text-brand font-medium"
                      : "text-foreground/80 hover:bg-muted hover:text-brand"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
