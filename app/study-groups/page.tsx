 "use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { BookOpen, Lightbulb, Plus } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { StudyCard } from "@/components/shared/study-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StudyGroup } from "@/types";

export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pendingGroupId, setPendingGroupId] = useState<string | null>(null);
  const [form, setForm] = useState({ course: "", title: "", schedule: "", location: "", seatsLeft: 1, focus: "" });

  const loadGroups = useCallback(async () => {
    const res = await fetch("/api/study-groups", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load study groups");
    const data = (await res.json()) as StudyGroup[];
    setStudyGroups(data);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await loadGroups();
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [loadGroups]);

  async function createGroup(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not create the group.");
        return;
      }

      await loadGroups();
      setForm({ course: "", title: "", schedule: "", location: "", seatsLeft: 1, focus: "" });
      setDialogOpen(false);
      setFeedback("Study group published successfully.");
    } catch {
      setFeedback("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function joinGroup(group: StudyGroup) {
    setPendingGroupId(group.id);
    setFeedback("");
    try {
      const res = await fetch(`/api/study-groups/${group.id}/join`, { method: "POST" });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not join this group.");
        return;
      }
      await loadGroups();
      setFeedback(`You joined ${group.course}: ${group.title}.`);
    } catch {
      setFeedback("Could not reach the server. Please try again.");
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
      activeTab="Find a Team"
      filters={["SYDE 121", "ECE 105", "CS 341", "STAT 231", "Tonight", "This week"]}
      tone="study"
      actions={
        <>
          <Button variant="secondary">
            <Lightbulb className="mr-2 h-4 w-4" />
            Study tips
          </Button>
          <Button variant="study" onClick={() => { setFeedback(""); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {feedback && !dialogOpen ? <p className="rounded-xl bg-study/10 px-4 py-3 text-sm font-semibold text-study">{feedback}</p> : null}
        <p className="inline-flex items-center gap-2 text-sm font-extrabold text-ink-soft">
          <BookOpen className="h-4 w-4 text-study" />
          Open groups with seats right now
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink">Featured Study Sessions</h2>
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading groups...</p> : null}
        {!loading && studyGroups.length === 0 ? (
          <p className="text-sm font-semibold text-ink-soft">No groups yet. Use Beta Lab to create one.</p>
        ) : null}
        <div className="space-y-4">
          {studyGroups.map((group) => (
            <StudyCard key={group.id} group={group} actionPending={pendingGroupId === group.id} onJoin={joinGroup} />
          ))}
        </div>
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
          {feedback ? <p className="text-sm font-semibold text-study">{feedback}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="study" disabled={submitting}>{submitting ? "Publishing..." : "Publish Group"}</Button>
          </div>
        </form>
      </Dialog>
    </LoopPageFrame>
  );
}
