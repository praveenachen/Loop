import { router } from "expo-router";
import type { Activity } from "../lib/types";
import { colors } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
export function activityPath(item: Activity) {
  return item.vertical === "marketplace"
    ? `/listings/${item.entityId}`
    : item.vertical === "rides"
      ? `/ride/${item.entityId}`
      : `/groups/${item.entityId}`;
}
export function ActivityCard({ item }: { item: Activity }) {
  return (
    <LoopCard style={{ backgroundColor: colors.surfaceSoft, padding: 16 }}>
      <LoopText variant="label">
        {item.vertical === "marketplace"
          ? "Marketplace"
          : item.vertical === "rides"
            ? "Ride"
            : "Study"}
      </LoopText>
      <LoopText variant="cardHeading">{item.title}</LoopText>
      <LoopText variant="smallBody">{item.detail}</LoopText>
      <LoopButton
        variant={item.vertical === "rides" ? "rides" : "secondary"}
        onPress={() => router.push(activityPath(item))}
      >
        View
      </LoopButton>
    </LoopCard>
  );
}
