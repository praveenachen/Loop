import { Edit3 } from "lucide-react-native";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopButton,
  ProfileSummaryCard,
  ReviewSnippet,
  EmptyState,
  LoopLoadState,
} from "../components";
import { useLoop } from "../lib/AppProvider";
import { colors } from "../theme";
export default function ProfileScreen() {
  const { data, loading, error, logout } = useLoop();
  const reviews = data.reviews;
  return (
    <LoopPageFrame
      tab={false}
      bare
      title="Profile + Reputation"
      subtitle="Your identity, ratings, and activity across Loop."
      goose="trophy"
      actions={
        <LoopButton
          icon={<Edit3 size={16} color={colors.white} />}
          onPress={() => router.push("/forms/profile")}
        >
          Edit Profile
        </LoopButton>
      }
    >
      <LoopLoadState />
      {!loading && !error ? (
        <>
          <LoopText variant="sectionHeading" accessibilityRole="header">
            Overview
          </LoopText>
          <ProfileSummaryCard user={data.user} />
          <LoopText variant="sectionHeading" accessibilityRole="header">
            Reviews
          </LoopText>
          {reviews.length ? (
            reviews.map((r) => <ReviewSnippet key={r.id} review={r} />)
          ) : (
            <EmptyState title="No reviews yet" message="Nothing here yet." />
          )}
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
