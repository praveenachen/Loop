import { useState } from "react";
import { View } from "react-native";
import {
  LoopPageFrame,
  ChatPreviewCard,
  EmptyState,
  LoopLoadState,
  LoopPill,
  SectionDropdown,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
const TYPES = ["All types", "Marketplace", "Rides", "Study Groups"] as const;
const CONTEXT: Record<string, string> = {
  Marketplace: "Marketplace",
  Rides: "Ride Coordination",
  "Study Groups": "Study Group",
};
export default function MessagesScreen() {
  const { data, loading, error } = useLoop();
  const [view, setView] = useState<"Inbox" | "Unread">("Inbox");
  const [type, setType] = useState<string>("All types");
  const visible = data.chats.filter(
    (c) =>
      (type === "All types" || c.context === CONTEXT[type]) &&
      (view !== "Unread" || c.unread > 0),
  );
  return (
    <LoopPageFrame
      title="Messages"
      subtitle="Keep marketplace, ride, and study coordination in one place."
      goose="backpack"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <LoopPill compact label="Inbox" selected={view === "Inbox"} onPress={() => setView("Inbox")} />
        <LoopPill compact label="Unread" selected={view === "Unread"} onPress={() => setView("Unread")} />
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <SectionDropdown options={TYPES} value={type} onChange={setType} />
        </View>
      </View>
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          visible.map((c) => <ChatPreviewCard key={c.id} chat={c} />)
        ) : (
          <EmptyState
            title="No matching conversations"
            message="Try another filter or message someone on the marketplace."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
