import { useState } from "react";
import {
  LoopPageFrame,
  LoopText,
  LoopCard,
  ChatPreviewCard,
  EmptyState,
  LoopLoadState,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
import { colors } from "../../theme";
export default function MessagesScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("Inbox");
  const [filter, setFilter] = useState("All messages");
  const visible = data.chats.filter(
    (c) =>
      (tab === "Inbox" ||
        c.context ===
          (tab === "Rides"
            ? "Ride Coordination"
            : tab === "Study Groups"
              ? "Study Group"
              : tab)) &&
      (filter !== "Unread" || c.unread > 0),
  );
  return (
    <LoopPageFrame
      title="Messages"
      subtitle="All pickups, rides, and study coordination stay in-app to keep trust and accountability visible."
      goose="backpack"
      tabs={["Inbox", "Marketplace", "Rides", "Study Groups"]}
      activeTab={tab}
      onTabChange={setTab}
      filters={["All messages", "Unread"]}
      activeFilter={filter}
      onFilterChange={setFilter}
    >
      <LoopCard style={{ padding: 16, backgroundColor: colors.surfaceSoft }}>
        <LoopText variant="pill" style={{ color: colors.ink }}>
          Student-only inbox
        </LoopText>
        <LoopText variant="smallBody">
          Only verified users can start or continue conversations in Loop.
        </LoopText>
      </LoopCard>
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          visible.map((c) => <ChatPreviewCard key={c.id} chat={c} />)
        ) : (
          <EmptyState
            title="No matching conversations"
            message="Try another inbox filter or contact a marketplace seller."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
