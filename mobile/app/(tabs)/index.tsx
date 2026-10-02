import { View } from "react-native";
import { router } from "expo-router";
import { Car, BookOpen, ShoppingBag, Lock } from "lucide-react-native";
import {
  LoopPageFrame,
  LoopText,
  ActionCard,
  SectionHeader,
  EmptyState,
  LoopLoadState,
} from "../../components";
import { ActivityCard } from "../../components/ActivityCard";
import { ChatPreviewCard } from "../../components/ChatPreviewCard";
import { useLoop } from "../../lib/AppProvider";
import { colors } from "../../theme";
export default function HomeScreen() {
  const { data, loading, error } = useLoop();
  return (
    <LoopPageFrame
      vivid
      large
      title={`Welcome back, ${data.user.name.split(" ")[0]}!`}
      subtitle="Marketplace, rides, and study plans in one verified campus network."
      goose="backpack"
    >
      <LoopText variant="sectionHeading" accessibilityRole="header">
        Overview
      </LoopText>
      <View style={{ flexDirection: "row", gap: 10 }} accessibilityLabel="Quick actions">
          <ActionCard
            compact
            title="Need a ride?"
            description="Match with trusted drivers in minutes."
            tone="rides"
            goose="driver"
            icon={<Car size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/rides")}
          />
          <ActionCard
            compact
            title="Need to study?"
            description="Join focused groups for your course."
            tone="study"
            goose="reader"
            icon={<BookOpen size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/study")}
          />
          <ActionCard
            compact
            title="Need stuff?"
            description="Buy, sell, and request with confidence."
            tone="marketplace"
            goose="trophy"
            icon={<ShoppingBag size={14} color={colors.inkSoft} />}
            onPress={() => router.push("/marketplace")}
          />
      </View>
      <LoopLoadState />
      {!loading && !error ? (
        <>
          <View style={{ gap: 10 }}>
            <SectionHeader title="Recent Activity" />
            {data.activity.length ? (
              <View style={{ gap: 8 }}>
                {data.activity.slice(0, 3).map((a) => (
                  <ActivityCard key={a.id} item={a} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="No recent activity"
                message="Create a listing, ride, or study group to get started."
              />
            )}
          </View>
          <View style={{ gap: 10 }}>
            <SectionHeader title="Messages" />
            {data.chats.length ? (
              <View style={{ gap: 8 }}>
                {data.chats.slice(0, 3).map((c) => (
                  <ChatPreviewCard key={c.id} chat={c} />
                ))}
              </View>
            ) : (
              <EmptyState title="No messages yet" message="Message someone on Loop to start a conversation." />
            )}
          </View>
          <View style={{ gap: 8 }}>
            <SectionHeader title="Campus Trust" />
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <Lock size={14} color={colors.inkSoft} style={{ marginTop: 3 }} />
              <LoopText variant="caption" style={{ flex: 1 }}>
                Every profile requires a verified @uwaterloo.ca identity before messaging or
                transactions.{" "}
                <LoopText
                  variant="caption"
                  accessibilityRole="link"
                  onPress={() => router.push("/safety")}
                  style={{ color: colors.ink, textDecorationLine: "underline" }}
                >
                  Safety + Trust
                </LoopText>
              </LoopText>
            </View>
          </View>
        </>
      ) : null}
    </LoopPageFrame>
  );
}
