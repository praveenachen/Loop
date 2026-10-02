import { useAction } from "../lib/useAction";
import { FeedbackBanner } from "./AsyncState";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { CalendarDays, MapPin, Users } from "lucide-react-native";
import type { StudyGroup } from "../lib/types";
import { useLoop } from "../lib/AppProvider";
import { colors } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { CardFooter, TrustRow, MetaLine } from "./CardParts";
import { CompactCard, CardTopSlot } from "./CompactCard";
export function StudyCard({
  group,
  detail = false,
}: {
  group: StudyGroup;
  detail?: boolean;
}) {
  const { mutate } = useLoop();
  const action = useAction();
  const title = `${group.course} • ${group.title}`;
  if (!detail)
    return (
      <CompactCard
        tone="study"
        left={
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open study group: ${group.title}`}
              onPress={() => router.push(`/groups/${group.id}`)}
              style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
            >
              <LoopText variant="cardTitle" numberOfLines={1}>{title}</LoopText>
            </Pressable>
            <LoopText variant="meta" numberOfLines={1}>
              {group.schedule}
            </LoopText>
            <LoopText variant="meta" numberOfLines={1}>
              {group.location}
            </LoopText>
          </>
        }
        right={
          <>
            <CardTopSlot>
              <LoopText variant="pill" numberOfLines={1} style={{ textAlign: "center", color: colors.ink }}>
                {group.seatsLeft} spots left
              </LoopText>
            </CardTopSlot>
            <LoopButton
              compact
              variant="study"
              disabled={
                action.busy || group.isOwner || group.joinedByCurrentUser || group.seatsLeft <= 0
              }
              onPress={() => { void action.run(() => mutate(`/api/study-groups/${group.id}/join`), "You joined the study group."); }}
            >
              {group.isOwner
                ? "Your Group"
                : group.joinedByCurrentUser
                  ? "Joined"
                  : group.seatsLeft <= 0
                    ? "Group Full"
                    : "Join Group"}
            </LoopButton>
          </>
        }
        below={
          <>
            {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
            {action.success ? <FeedbackBanner message={action.success} /> : null}
          </>
        }
      />
    );
  return (
    <LoopCard tone="study">
      {detail ? (
        <LoopText variant="cardHeading">{title}</LoopText>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open study group: ${group.title}`}
          onPress={() => router.push(`/groups/${group.id}`)}
          style={({ pressed }) => ({
            minHeight: 44,
            justifyContent: "center",
            opacity: pressed ? 0.72 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          <LoopText variant="cardHeading" numberOfLines={2}>{title}</LoopText>
        </Pressable>
      )}
      <LoopText variant="smallBody" numberOfLines={detail ? undefined : 3}>{group.focus}</LoopText>
      <CardFooter>
        <TrustRow user={group.host} />
        <LoopText variant="chip">{group.host.name}</LoopText>
        <MetaLine icon={<Users size={14} color={colors.inkSoft} />}>
          {group.seatsLeft} spots left
        </MetaLine>
        <MetaLine icon={<CalendarDays size={14} color={colors.inkSoft} />}>
          {group.schedule}
        </MetaLine>
        <MetaLine icon={<MapPin size={14} color={colors.inkSoft} />}>
          {group.location}
        </MetaLine>
        <LoopButton
          variant="study"
          disabled={
            action.busy || group.isOwner || group.joinedByCurrentUser || group.seatsLeft <= 0
          }
          onPress={() => { void action.run(() => mutate(`/api/study-groups/${group.id}/join`), "You joined the study group."); }}
        >
          {group.isOwner
            ? "Your Group"
            : group.joinedByCurrentUser
              ? "Joined"
              : group.seatsLeft <= 0
                ? "Group Full"
                : "Join Group"}
        </LoopButton>
      </CardFooter>
      {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
      {action.success ? <FeedbackBanner message={action.success} /> : null}
    </LoopCard>
  );
}
