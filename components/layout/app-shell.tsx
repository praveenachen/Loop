"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Search, ShieldCheck, Star } from "lucide-react";
import { signOut } from "next-auth/react";

import { GooseImage } from "@/components/brand/goose-image";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/rides", label: "Rides" },
  { href: "/study-groups", label: "Study Groups" },
  { href: "/messages", label: "Messages" },
  { href: "/profile", label: "Profile" },
  { href: "/beta-lab", label: "Beta Lab" },
  { href: "/beta-admin", label: "Beta Admin" }
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#f2f0eb] p-4 lg:p-6">
        <div className="surface-panel mx-auto h-[calc(100vh-2rem)] max-w-[1400px] rounded-[32px] border border-stroke bg-surface p-5 shadow-lift lg:p-8">
          <div className="grid h-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="relative h-full overflow-hidden rounded-3xl border border-stroke bg-gradient-to-br from-marketplace/20 via-rides/25 to-study/20 p-8">
              <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-marketplace/20 blur-2xl" />
              <div className="absolute -right-10 bottom-10 h-52 w-52 rounded-full bg-study/20 blur-2xl" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-6 inline-flex items-center gap-3">
                    <GooseImage src="/geese/logo-goose-transparent.png" alt="Loop logo" className="h-12 w-12" fallbackClassName="h-12 w-12" />
                    <span className="font-display text-4xl font-semibold text-ink">Loop</span>
                  </div>
                  <h1 className="max-w-xl font-display text-5xl font-semibold leading-tight text-ink">
                    Your campus marketplace, rides, and study circle in one place.
                  </h1>
                  <p className="mt-4 max-w-xl text-lg text-ink-soft">
                    Sign in with your verified Waterloo account and jump back into your dashboard.
                  </p>
                </div>
                <div className="mt-8 space-y-8">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink-soft">Why Loop</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7ef7c2] text-[#127f56]">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-extrabold text-ink">UW Verified Only</p>
                      </div>
                      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8fd1ff] text-[#0c6fb7]">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-extrabold text-ink">In-App Messaging</p>
                      </div>
                      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe68a] text-[#8e6800]">
                          <Star className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-extrabold text-ink">Ratings + History</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="rounded-full bg-marketplace/20 px-4 py-2 text-sm font-extrabold text-marketplace">Marketplace</div>
                    <div className="rounded-full bg-rides/40 px-4 py-2 text-sm font-extrabold text-ink">Rides</div>
                    <div className="rounded-full bg-study/20 px-4 py-2 text-sm font-extrabold text-study">Study-Pair</div>
                  </div>
                </div>
              </div>
            </section>
            <section className="flex items-center justify-center lg:justify-center">{children}</section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f0eb] p-4 lg:p-6">
      <div className="surface-panel mx-auto min-h-[calc(100vh-2rem)] max-w-[1400px] rounded-[32px] border border-stroke bg-surface px-5 py-5 shadow-lift lg:px-8 lg:py-6">
        <header className="mb-5 border-b border-stroke/80 pb-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <GooseImage
                src="/geese/logo-goose.png"
                alt="Loop goose logo"
                className="h-11 w-11 rounded-xl object-contain"
                fallbackClassName="h-11 w-11"
              />
              <span className="font-display text-3xl font-semibold tracking-tight text-ink">Loop</span>
            </Link>
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-stroke bg-white text-ink transition hover:bg-surface-soft">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-extrabold transition",
                  pathname === item.href
                    ? "border-ink/20 bg-ink text-white"
                    : "border-stroke bg-white text-ink-soft hover:bg-surface-soft hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-trust/30 bg-trust/10 px-3 py-1.5 text-xs font-extrabold text-trust">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified UW
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
              className="rounded-full border border-stroke bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft transition hover:bg-surface-soft hover:text-ink"
            >
              Log out
            </button>
          </div>
          <label className="mt-4 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stroke bg-white px-4 py-3 shadow-card focus-within:border-accent">
            <Search className="h-4 w-4 text-ink-soft" />
            <input
              placeholder="Search listings, rides, study groups..."
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-soft"
            />
          </label>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
