 "use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { StudyCard } from "@/components/shared/study-card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, FeedbackBanner, LoadingState } from "@/components/ui/async-state";
import { Dialog } from "@/components/ui/dialog";
import { StudyGroup } from "@/types";

export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("Find a Team");
  const [activeFilter, setActiveFilter] = useState("All courses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [pendingGroupId, setPendingGroupId] = useState<string | null>(null);
  const [form, setForm] = useState({ course: "", title: "", schedule: "", location: "", seatsLeft: 1, focus: "" });

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/study-groups", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load study groups");
      const data = (await res.json()) as StudyGroup[];
      setStudyGroups(data);
    } catch {
      setLoadError("Study groups could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  const filteredGroups = useMemo(() => {
    return studyGroups.filter((group) => {
      if (activeTab === "Your History" && !group.isOwner && !group.joinedByCurrentUser) return false;
      if (activeTab === "Create a Request" && !group.isOwner) return false;
      if (activeFilter === "Open spots" && group.seatsLeft <= 0) return false;
      if (activeFilter !== "All courses" && activeFilter !== "Open spots" && group.course !== activeFilter) return false;
      return true;
    });
  }, [activeFilter, activeTab, studyGroups]);

  async function createGroup(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback({ message: payload.error ?? "Could not create the group.", tone: "error" });
        return;
      }

      await loadGroups();
      setForm({ course: "", title: "", schedule: "", location: "", seatsLeft: 1, focus: "" });
      setDialogOpen(false);
      setFeedback({ message: "Study group published successfully.", tone: "success" });
    } catch {
      setFeedback({ message: "Could not reach the server. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function joinGroup(group: StudyGroup) {
    setPendingGroupId(group.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/study-groups/${group.id}/join`, { method: "POST" });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback({ message: payload.error ?? "Could not join this group.", tone: "error" });
        return;
      }
      await loadGroups();
      setFeedback({ message: `You joined ${group.course}: ${group.title}.`, tone: "success" });
    } catch {
      setFeedback({ message: "Could not reach the server. Please try again.", tone: "error" });
    } finally {
      setPendingGroupId(null);
    }
  }

  return (
    <LoopPageFrame
      title="Study-Pair"
      subtitle="Find your flock. Join high-signal groups by course, focus area, and host reputation."
      mascotSrc="/geese/goose-reader.png"
      mascotAlt="Reader goose mascot"
      tabs={["Find a Team", "Create a Request", "Your History"]}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === "Create a Request") setDialogOpen(true);
      }}
      filters={["All courses", "Open spots", "SYDE 121", "ECE 105", "CS 341", "STAT 231"]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      tone="study"
      actions={
        <Button variant="study" onClick={() => { setFeedback(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
        </Button>
      }
    >
      <div className="space-y-4">
        {feedback && !dialogOpen ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
        <p className="inline-flex items-center gap-2 text-sm font-extrabold text-ink-soft">
          <BookOpen className="h-4 w-4 text-study" />
          Open groups with seats right now
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink">Featured Study Sessions</h2>
        {loading ? <LoadingState label="Loading study groups..." rows={2} /> : null}
        {!loading && loadError ? <ErrorState message={loadError} onRetry={() => void loadGroups()} retrying={loading} /> : null}
        {!loading && !loadError && filteredGroups.length === 0 ? (
          <EmptyState title="No matching study groups" message="Try another course or create a new group." />
        ) : null}
        {!loading && !loadError ? <div className="space-y-4">
          {filteredGroups.map((group) => (
            <StudyCard key={group.id} group={group} actionPending={pendingGroupId === group.id} onJoin={joinGroup} />
          ))}
        </div> : null}
      </div>
      <Dialog
        open={dialogOpen}
        title="Create Study Group"
        description="Set a course, time, and focus so classmates can find your session."
        onClose={() => setDialogOpen(false)}
      >
        <form className="space-y-3" onSubmit={createGroup}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">Course
              <input required minLength={2} maxLength={20} placeholder="CS 246" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            </label>
            <label className="block text-sm font-semibold text-ink">Available spots
              <input required min={0} max={60} step={1} type="number" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.seatsLeft} onChange={(e) => setForm({ ...form, seatsLeft: Number(e.target.value) })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">Group title
            <input required minLength={3} maxLength={140} placeholder="Midterm Review Session" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">Schedule
              <input required minLength={3} maxLength={120} placeholder="Sunday, 3:00 PM" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
            </label>
            <label className="block text-sm font-semibold text-ink">Location
              <input required minLength={2} maxLength={120} placeholder="DC Library" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">Focus
            <textarea required minLength={4} maxLength={240} placeholder="Topics and goals for this session" className="mt-1 min-h-24 w-full rounded-xl border border-stroke px-3 py-2" value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} />
          </label>
          {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="study" disabled={submitting}>{submitting ? "Publishing..." : "Publish Group"}</Button>
          </div>
        </form>
      </Dialog>
    </LoopPageFrame>
  );
}
