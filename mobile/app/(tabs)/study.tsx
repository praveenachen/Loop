import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopButton,
  StudyCard,
  EmptyState,
  LoopLoadState,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
export default function StudyScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("Find a Team");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.groups.filter(
    (g) =>
      (tab !== "Your History" || g.isOwner || g.joinedByCurrentUser) &&
      (tab !== "Create a Request" || g.isOwner) &&
      (!query ||
        [g.course, g.title, g.schedule, g.location, g.focus, g.host.name].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Study-Pair"
      subtitle="Find your flock. Join high-signal groups by course, focus area, and host reputation."
      goose="reader"
      tone="study"
      tabs={["Find a Team", "Create a Request", "Your History"]}
      activeTab={tab}
      onTabChange={(t) => {
        setTab(t);
        if (t === "Create a Request") router.push("/forms/group");
      }}
      searchValue={searchQuery}
      searchPlaceholder="Search courses, topics, hosts, or locations"
      onSearchChange={setSearchQuery}
      actions={
        <LoopButton
          variant="study"
          icon={<Plus size={16} color={colors.white} />}
          onPress={() => router.push("/forms/group")}
        >
          Create Group
        </LoopButton>
      }
    >
      <LoopText variant="pill">Open groups with seats right now</LoopText>
      <LoopText variant="sectionHeading" accessibilityRole="header">
        Featured Study Sessions
      </LoopText>
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          visible.map((g) => <StudyCard key={g.id} group={g} />)
        ) : (
          <EmptyState
            title="No matching study groups"
            message="Try another course or create a new group."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
