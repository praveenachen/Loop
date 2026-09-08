"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Car, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";

import { GooseImage } from "@/components/brand/goose-image";
import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/async-state";
import { ChatPreview, User } from "@/types";

interface DashboardActivity {
  id: string;
  label: "Marketplace" | "Ride" | "Study";
  title: string;
  detail: string;
  href: string;
}

interface DashboardResponse {
  user: User;
  recentActivity: DashboardActivity[];
  chats: ChatPreview[];
}

const quickActions = [
  {
    title: "Need a ride?",
    caption: "Match with trusted drivers in minutes.",
    href: "/rides",
    icon: Car,
    image: "/geese/goose-driver.png",
    tone: "bg-rides/25"
  },
  {
    title: "Need to study?",
    caption: "Join focused groups for your course.",
    href: "/study-groups",
    icon: BookOpen,
    image: "/geese/goose-reader.png",
    tone: "bg-study/15"
  },
  {
    title: "Need stuff?",
    caption: "Buy, sell, and request with confidence.",
    href: "/marketplace",
    icon: ShoppingBag,
    image: "/geese/goose-trophy.png",
    tone: "bg-marketplace/15"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [recentActivity, setRecentActivity] = useState<DashboardActivity[]>([]);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load dashboard");
      const data = (await response.json()) as DashboardResponse;
      setCurrentUser(data.user);
      setRecentActivity(data.recentActivity);
      setChats(data.chats);
    } catch {
      setDashboardError("Your dashboard could not be loaded. Check your connection and try again.");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <LoopPageFrame
      title={`Welcome back, ${currentUser?.name ?? "friend"}!`}
      subtitle="Loop keeps your student life organized across rides, marketplace pickups, and study plans in one verified campus network."
      mascotSrc="/geese/goose-backpack.png"
      mascotAlt="Backpack goose mascot"
      tabs={["Overview", "Recent Activity", "Messages"]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tone="neutral"
      actions={
        <>
          <Button variant="secondary" onClick={() => setActiveTab("Messages")}>Open Messages</Button>
          <Button onClick={() => router.push("/marketplace")}>Post Something</Button>
        </>
      }
    >
      <div className="space-y-6">
        {activeTab === "Overview" ? <div className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-[24px] border border-stroke bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <p className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] text-ink-soft">
                  <Icon className="h-3.5 w-3.5" />
                  Quick start
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{action.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{action.caption}</p>
                <div className={`mt-4 grid h-44 w-44 place-items-center rounded-full ${action.tone} mx-auto`}>
                  <GooseImage src={action.image} alt={action.title} className="h-28 w-28" fallbackClassName="h-28 w-28" />
                </div>
              </Link>
            );
          })}
        </div> : null}

        {dashboardLoading ? <LoadingState label="Loading recent activity..." rows={2} /> : null}
        {!dashboardLoading && dashboardError ? <ErrorState message={dashboardError} onRetry={() => void loadDashboard()} retrying={dashboardLoading} /> : null}
        {!dashboardLoading && !dashboardError ? <>

        {activeTab !== "Messages" ? <><h2 className="font-display text-3xl font-semibold text-ink">Recent Activity</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {recentActivity.map((item) => (
            <article key={`${item.label}-${item.id}`} className="rounded-2xl border border-stroke bg-surface-soft p-4">
              <p className="text-xs font-extrabold uppercase text-ink-soft">{item.label}</p>
              <p className="mt-1 text-lg font-extrabold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.detail}</p>
              <Button className="mt-3" size="sm" variant={item.label === "Ride" ? "rides" : "secondary"} onClick={() => router.push(item.href)}>
                View
              </Button>
            </article>
          ))}
          {recentActivity.length === 0 ? <EmptyState title="No recent activity" message="Create a listing, ride, or study group to get started." /> : null}
        </div></> : null}

        {activeTab !== "Recent Activity" ? <div className="rounded-2xl border border-stroke bg-white p-4">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold text-ink">
            <Sparkles className="h-4 w-4 text-accent" />
            Message pulse
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {chats.slice(0, 3).map((chat) => (
              <Link key={chat.id} href={`/messages?conversation=${encodeURIComponent(chat.id)}`} className="rounded-xl border border-stroke bg-surface-soft p-3 transition hover:border-accent/40">
                <p className="font-extrabold text-ink">{chat.with.name}</p>
                <p className="text-xs text-ink-soft">{chat.context}</p>
                <p className="mt-2 text-sm text-ink-soft">{chat.lastMessage}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-ink-soft">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {chat.unread > 0 ? `${chat.unread} unread` : "All caught up"}
                </p>
              </Link>
            ))}
            {chats.length === 0 ? <EmptyState title="No conversations yet" message="Contact a marketplace seller to start one." /> : null}
          </div>
        </div> : null}
        </> : null}
      </div>
    </LoopPageFrame>
  );
}
