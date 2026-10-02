import { router } from "expo-router";
import type { Activity } from "../lib/types";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { CompactCard } from "./CompactCard";
export function activityPath(item: Activity) {
  return item.vertical === "marketplace"
    ? `/listings/${item.entityId}`
    : item.vertical === "rides"
      ? `/ride/${item.entityId}`
      : `/groups/${item.entityId}`;
}
export function ActivityCard({ item }: { item: Activity }) {
  const variant =
    item.vertical === "rides" ? "rides" : item.vertical === "marketplace" ? "marketplace" : "study";
  return (
    <CompactCard
      tone={variant}
      rightWidth={84}
      left={
        <>
          <LoopText variant="eyebrow">
            {item.vertical === "marketplace" ? "Marketplace" : item.vertical === "rides" ? "Ride" : "Study"}
          </LoopText>
          <LoopText variant="cardTitle" numberOfLines={1}>
            {item.title}
          </LoopText>
          <LoopText variant="meta" numberOfLines={1}>
            {item.detail}
          </LoopText>
        </>
      }
      right={
        <LoopButton
          compact
          variant={variant}
          onPress={() => router.push(activityPath(item))}
        >
          View
        </LoopButton>
      }
    />
  );
}
