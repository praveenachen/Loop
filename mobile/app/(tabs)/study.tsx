import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopButton,
  StudyCard,
  EmptyState,
  LoopLoadState,
  SectionHeader,
  SectionDropdown,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
const TABS = ["See All", "Your Groups", "Your History"] as const;
export default function StudyScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("See All");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.groups.filter(
    (g) =>
      (tab !== "Your Groups" || g.isOwner) &&
      (tab !== "Your History" || g.joinedByCurrentUser) &&
      (!query ||
        [g.course, g.title, g.schedule, g.location, g.focus, g.host.name].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Study-Pair"
      subtitle="Find focused groups by course, topic, and host reputation."
      goose="reader"
      tone="study"
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
      <SectionHeader
        title={tab === "See All" ? "Study Sessions" : tab}
        subtitle={`${visible.length} group${visible.length === 1 ? "" : "s"}`}
        action={
<SectionDropdown options={TABS} value={tab} onChange={setTab} />
        }
      />
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          <View style={{ gap: 8 }}>
            {visible.map((g) => <StudyCard key={g.id} group={g} />)}
          </View>
        ) : (
          <EmptyState
            title="No matching study groups"
            message="Try another search or create a new group."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
