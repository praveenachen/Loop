"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bird, BookOpen, Car, Home, MessageSquare, ShoppingBag, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/rides", label: "Rides", icon: Car },
  { href: "/study-groups", label: "Study Groups", icon: BookOpen },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-stroke bg-white/90 p-6 backdrop-blur xl:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--goose))] text-ink">
          <Bird className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">Loop</p>
          <p className="text-xs text-ink-soft">University of Waterloo</p>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-ink text-white shadow-card" : "text-ink-soft hover:bg-surface-soft hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-2xl border border-stroke bg-surface-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Campus Trust</p>
        <p className="mt-2 text-sm text-ink">
          Every profile requires a verified `@uwaterloo.ca` identity before messaging or transactions.
        </p>
      </div>
    </aside>
  );
}
