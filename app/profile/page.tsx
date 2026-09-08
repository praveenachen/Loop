 "use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Trophy } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { ProfileSummaryCard } from "@/components/shared/profile-summary-card";
import { ReviewSnippet } from "@/components/shared/review-snippet";
import { Button } from "@/components/ui/button";
import { Review, User } from "@/types";

interface ProfileResponse {
  user: User;
  reviews: Review[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    program: "",
    year: "",
    avatar: ""
  });
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeFilter, setActiveFilter] = useState("All activity");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = (await res.json()) as ProfileResponse;
        setProfile(data);
        setEditForm({
          name: data.user.name,
          program: data.user.program,
          year: data.user.year,
          avatar: data.user.avatar
        });
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const reviews = useMemo(() => {
    return (profile?.reviews ?? []).map((review) => ({
      ...review,
      createdAt: new Date(review.createdAt).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    }));
  }, [profile?.reviews]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "All activity") return reviews;
    const term = activeFilter === "Study groups" ? "study" : activeFilter.toLowerCase();
    return reviews.filter((review) => `${review.subject} ${review.body}`.toLowerCase().includes(term));
  }, [activeFilter, reviews]);

  async function saveProfile() {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const payload = (await res.json()) as User | { error?: string };
      if (!res.ok) {
        setStatus((payload as { error?: string }).error ?? "Failed to update profile.");
        return;
      }
      setProfile((prev) => (prev ? { ...prev, user: payload as User } : prev));
      setEditing(false);
      setStatus("Profile updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <LoopPageFrame
      title="Profile + Reputation"
      subtitle="Your ratings, completed exchanges, and verified identity are your trust score across every Loop feature."
      mascotSrc="/geese/goose-trophy.png"
      mascotAlt="Trophy goose mascot"
      tabs={["Overview", "Reviews", "History", "Verification"]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filters={["All activity", "Marketplace", "Rides", "Study groups"]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      tone="neutral"
      actions={
        <>
          <Button onClick={() => setEditing((v) => !v)}>
            <Edit3 className="mr-2 h-4 w-4" />
            {editing ? "Close Editor" : "Edit Profile"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {activeTab !== "Reviews" && activeTab !== "History" ? <div className="rounded-2xl border border-stroke bg-surface-soft p-4">
          <p className="inline-flex items-center gap-2 text-sm font-extrabold text-ink">
            <Trophy className="h-4 w-4 text-warning" />
            Reputation moves with you
          </p>
          <p className="mt-1 text-sm text-ink-soft">Trust is shared across marketplace deals, rides completed, and study groups hosted.</p>
        </div> : null}
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading profile...</p> : null}
        {editing ? (
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.1em] text-ink-soft">Edit Profile</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-stroke px-3 py-2 text-sm"
                placeholder="Full name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                className="rounded-xl border border-stroke px-3 py-2 text-sm"
                placeholder="Program"
                value={editForm.program}
                onChange={(e) => setEditForm((f) => ({ ...f, program: e.target.value }))}
              />
              <input
                className="rounded-xl border border-stroke px-3 py-2 text-sm"
                placeholder="Year"
                value={editForm.year}
                onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
              />
              <input
                className="rounded-xl border border-stroke px-3 py-2 text-sm"
                placeholder="Avatar initials (2-3 chars)"
                maxLength={4}
                value={editForm.avatar}
                onChange={(e) => setEditForm((f) => ({ ...f, avatar: e.target.value }))}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {status ? <p className="text-sm font-semibold text-ink-soft">{status}</p> : null}
            </div>
          </div>
        ) : null}
        {profile?.user && activeTab !== "Reviews" ? <ProfileSummaryCard user={profile.user} /> : null}
        {!loading && !profile?.user ? <p className="text-sm font-semibold text-ink-soft">Profile not available.</p> : null}
        {!loading && filteredReviews.length === 0 && (activeTab === "Overview" || activeTab === "Reviews") ? (
          <p className="text-sm font-semibold text-ink-soft">No reviews yet for this account.</p>
        ) : null}
        {activeTab === "Overview" || activeTab === "Reviews" ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredReviews.map((review) => (
            <ReviewSnippet key={review.id} review={review} />
          ))}
        </div> : null}
      </div>
    </LoopPageFrame>
  );
}
