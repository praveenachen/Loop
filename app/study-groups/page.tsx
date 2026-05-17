 "use client";

import { useEffect, useState } from "react";
import { BookOpen, Lightbulb, Plus } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { StudyCard } from "@/components/shared/study-card";
import { Button } from "@/components/ui/button";
import { StudyGroup } from "@/types";

export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/study-groups", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load study groups");
        const data = (await res.json()) as StudyGroup[];
        setStudyGroups(data);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

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
          <Button variant="study">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </>
      }
    >
      <div className="space-y-4">
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
            <StudyCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </LoopPageFrame>
  );
}
