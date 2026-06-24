"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, ShoppingBag, CalendarDays, Heart, LogOut, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { href: "/account", label: "Account", icon: User },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export function AccountMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Until hydrated, render a neutral icon that matches SSR (avoids mismatch).
  if (!mounted || !user) {
    return (
      <Button variant="ghost" size="icon" aria-label={mounted ? "Sign in" : "Account"} className="min-h-[44px] min-w-[44px]" asChild>
        <Link href={mounted ? "/login" : "/account"}>
          {mounted ? <LogIn className="size-5" /> : <User className="size-5" />}
        </Link>
      </Button>
    );
  }

  function signOut() {
    logout();
    toast.success("Signed out.");
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Account menu for ${user.firstName}`}
          className="min-h-[44px] min-w-[44px]"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {initials(`${user.firstName} ${user.lastName}`)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-foreground">{user.firstName} {user.lastName}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}><Icon className="size-4" /> {label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={signOut}>
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
