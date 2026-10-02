import { useState } from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Car, BookOpen, ShoppingBag } from "lucide-react-native";
import {
  LoopPageFrame,
  LoopText,
  LoopCard,
  LoopButton,
  ActionCard,
  EmptyState,
  LoopLoadState,
} from "../../components";
import { ActivityCard } from "../../components/ActivityCard";
import { useLoop } from "../../lib/AppProvider";
import { colors } from "../../theme";
export default function HomeScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("Overview");
  return (
    <LoopPageFrame
      title={`Welcome back, ${data.user.name}!`}
      subtitle="Loop keeps your student life organized across rides, marketplace pickups, and study plans in one verified campus network."
      goose="backpack"
      tabs={["Overview", "Recent Activity", "Messages", "Safety + Trust"]}
      activeTab={tab}
      onTabChange={setTab}
      actions={
        <>
          <LoopButton variant="secondary" onPress={() => setTab("Messages")}>
            Open Messages
          </LoopButton>
          <LoopButton onPress={() => router.push("/forms/listing")}>
            Post Something
          </LoopButton>
        </>
      }
    >
      {tab === "Overview" ? (
        <>
          <ActionCard
            title="Need a ride?"
            description="Match with trusted drivers in minutes."
            tone="rides"
            goose="driver"
            icon={<Car size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/rides")}
          />
          <ActionCard
            title="Need to study?"
            description="Join focused groups for your course."
            tone="study"
            goose="reader"
            icon={<BookOpen size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/study")}
          />
          <ActionCard
            title="Need stuff?"
            description="Buy, sell, and request with confidence."
            tone="marketplace"
            goose="trophy"
            icon={<ShoppingBag size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/marketplace")}
          />
        </>
      ) : null}
      <LoopLoadState />
      {!loading && !error ? (
        <>
          {tab === "Overview" || tab === "Recent Activity" ? (
            <>
              <LoopText variant="sectionHeading">Recent Activity</LoopText>
              {data.activity.length ? (
                data.activity.map((a) => <ActivityCard key={a.id} item={a} />)
              ) : (
                <EmptyState
                  title="No recent activity"
                  message="Create a listing, ride, or study group to get started."
                />
              )}
            </>
          ) : null}
          {tab === "Overview" || tab === "Messages" ? (
            <LoopCard style={{ padding: 16 }}>
              <LoopText variant="pill" style={{ color: colors.ink }}>
                ✦ Message pulse
              </LoopText>
              {data.chats.slice(0, 3).map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => router.push(`/messages/${c.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open conversation with ${c.with.name}`}
                >
                  <LoopCard
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: colors.surfaceSoft,
                    }}
                  >
                    <LoopText variant="pill" style={{ color: colors.ink }}>
                      {c.with.name}
                    </LoopText>
                    <LoopText variant="chip">{c.context}</LoopText>
                    <LoopText variant="smallBody">{c.lastMessage}</LoopText>
                    <LoopText variant="chip">
                      {c.unread > 0 ? `${c.unread} unread` : "All caught up"}
                    </LoopText>
                  </LoopCard>
                </Pressable>
              ))}
            </LoopCard>
          ) : null}
          {tab === "Safety + Trust" ? (
            <LoopCard style={{ backgroundColor: colors.surfaceSoft }}>
              <LoopText variant="sectionHeading">Campus Trust</LoopText>
              <LoopText>
                Every profile requires a verified @uwaterloo.ca identity before
                messaging or transactions.
              </LoopText>
              <LoopButton
                variant="secondary"
                onPress={() => router.push("/safety")}
              >
                Safety + Trust
              </LoopButton>
            </LoopCard>
          ) : null}
        </>
      ) : null}
    </LoopPageFrame>
  );
}
