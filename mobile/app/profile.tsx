import { Edit3 } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopCard,
  LoopButton,
  ProfileSummaryCard,
  ReviewSnippet,
  EmptyState,
  LoopLoadState,
  VerificationBadge,
} from "../components";
import { ActivityCard } from "../components/ActivityCard";
import { useLoop } from "../lib/AppProvider";
import { colors } from "../theme";
export default function ProfileScreen() {
  const { data, loading, error, logout } = useLoop();
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All activity");
  const term =
    filter === "Study groups"
      ? "study"
      : filter === "Rides"
        ? "ride"
        : filter.toLowerCase();
  const reviews = data.reviews.filter(
    (r) =>
      filter === "All activity" ||
      `${r.subject} ${r.body}`.toLowerCase().includes(term) ||
      (filter === "Study groups" && r.subject.includes("CS 341")),
  );
  const activity = data.activity.filter(
    (a) =>
      filter === "All activity" ||
      a.vertical ===
        (filter === "Marketplace"
          ? "marketplace"
          : filter === "Rides"
            ? "rides"
            : "study"),
  );
  return (
    <LoopPageFrame
      tab={false}
      title="Profile + Reputation"
      subtitle="Your ratings, completed exchanges, and verified identity are your trust score across every Loop feature."
      goose="trophy"
      tabs={["Overview", "Reviews", "History", "Verification"]}
      activeTab={tab}
      onTabChange={setTab}
      filters={["All activity", "Marketplace", "Rides", "Study groups"]}
      activeFilter={filter}
      onFilterChange={setFilter}
      actions={
        <LoopButton
          icon={<Edit3 size={16} color={colors.white} />}
          onPress={() => router.push("/forms/profile")}
        >
          Edit Profile
        </LoopButton>
      }
    >
      {tab !== "Reviews" && tab !== "History" ? (
        <LoopCard style={{ padding: 16, backgroundColor: colors.surfaceSoft }}>
          <LoopText variant="pill" style={{ color: colors.ink }}>
            Reputation moves with you
          </LoopText>
          <LoopText variant="smallBody">
            Trust is shared across marketplace deals, rides completed, and study
            groups hosted.
          </LoopText>
        </LoopCard>
      ) : null}
      <LoopLoadState />
      {!loading && !error ? (
        <>
          {tab !== "Reviews" ? <ProfileSummaryCard user={data.user} /> : null}
          {tab === "Overview" || tab === "Reviews" ? (
            reviews.length ? (
              reviews.map((r) => <ReviewSnippet key={r.id} review={r} />)
            ) : (
              <EmptyState
                title="No matching reviews"
                message="Try another activity filter."
              />
            )
          ) : null}
          {tab === "History" ? (
            <>
              <LoopText variant="sectionHeading">Your Activity</LoopText>
              {activity.length ? (
                activity.map((a) => <ActivityCard key={a.id} item={a} />)
              ) : (
                <EmptyState
                  title="No matching activity"
                  message="Try another activity filter."
                />
              )}
            </>
          ) : null}
          {tab === "Verification" ? (
            <LoopCard>
              <LoopText variant="sectionHeading">Campus identity</LoopText>
              <VerificationBadge level={data.user.verification} />
              <LoopText variant="smallBody">
                Your Waterloo identity and reputation stay visible across Loop.
              </LoopText>
              <LoopText variant="smallBody">
                Your profile shows the verification level recorded by Loop.
              </LoopText>
            </LoopCard>
          ) : null}
          <LoopButton
            variant="secondary"
            onPress={() => {
              void logout().catch(() => {});

            }}
          >
            Log out
          </LoopButton>
        </>
      ) : null}
    </LoopPageFrame>
  );
}
