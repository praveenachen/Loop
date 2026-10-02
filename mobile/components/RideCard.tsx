import { useAction } from "../lib/useAction";
import { FeedbackBanner } from "./AsyncState";
import { View } from "react-native";
import { router } from "expo-router";
import { Car, Users } from "lucide-react-native";
import type { RideListing } from "../lib/types";
import { useLoop } from "../lib/AppProvider";
import { colors } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { PressableScale } from "./PressableScale";
import { LoopButton } from "./LoopButton";
import { StatusBadge } from "./StatusBadge";
import { CardFooter, TrustRow, MetaLine } from "./CardParts";
import { CompactCard, CardTopSlot } from "./CompactCard";
import { PriceText } from "./PriceText";
export function RideCard({
  ride,
  detail = false,
}: {
  ride: RideListing;
  detail?: boolean;
}) {
  const { mutate } = useLoop();
  const action = useAction();
  const unavailable = ride.seats <= 0 || ride.seatStatus === "waitlist";
  const label =
    ride.mode === "request"
      ? "Ride Requested"
      : ride.isOwner
        ? "Your Ride"
        : ride.requestedByCurrentUser
          ? "Seat Requested"
          : unavailable
            ? "Ride Full"
            : "Request Seat";
  if (!detail)
    return (
      <CompactCard
        tone="rides"
        left={
          <>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Open ride: ${ride.route}`}
              onPress={() => router.push(`/ride/${ride.id}`)}
            >
              <LoopText variant="cardTitle" numberOfLines={1}>{ride.route}</LoopText>
            </PressableScale>
            <LoopText variant="meta" numberOfLines={1}>
              {ride.departure}
            </LoopText>
            <LoopText variant="meta" numberOfLines={1}>
              {ride.mode === "request" ? "Looking for a driver" : `${ride.seats} seat${ride.seats === 1 ? "" : "s"} left`}
            </LoopText>
          </>
        }
        right={
          <>
            <CardTopSlot>
              <PriceText amount={ride.pricePerSeat} unit="/seat" />
            </CardTopSlot>
            <LoopButton
              compact
              variant="rides"
              disabled={
                action.busy || ride.mode === "request" ||
                ride.isOwner ||
                ride.requestedByCurrentUser ||
                unavailable
              }
              onPress={() => { void action.run(() => mutate(`/api/rides/${ride.id}/request-seat`), "Seat requested successfully.", true); }}
            >
              {label}
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
    <LoopCard tone="rides">
      {detail ? (
        <LoopText variant="cardHeading">{ride.route}</LoopText>
      ) : (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Open ride: ${ride.route}`}
          onPress={() => router.push(`/ride/${ride.id}`)}
          style={{
            minHeight: 44,
            justifyContent: "center" }}
        >
          <LoopText variant="cardHeading" numberOfLines={2}>{ride.route}</LoopText>
        </PressableScale>
      )}
      <StatusBadge status={ride.seatStatus} />
      <LoopText variant="smallBody" numberOfLines={2}>
        {ride.departure} • ${ride.pricePerSeat}/seat
      </LoopText>
      <LoopText variant="smallBody" numberOfLines={2}>{ride.car}</LoopText>
      <CardFooter>
        <TrustRow user={ride.driver} />
        <MetaLine icon={<Users size={14} color={colors.inkSoft} />}>
          {ride.mode === "request"
            ? "Looking for a driver"
            : `${ride.seats} seats left`}
        </MetaLine>
        <MetaLine icon={<Car size={14} color={colors.inkSoft} />}>
          {ride.driver.name}
        </MetaLine>
        <LoopButton
          variant="rides"
          disabled={
            action.busy || ride.mode === "request" ||
            ride.isOwner ||
            ride.requestedByCurrentUser ||
            unavailable
          }
          onPress={() => { void action.run(() => mutate(`/api/rides/${ride.id}/request-seat`), "Seat requested successfully.", true); }}
        >
          {label}
        </LoopButton>
      </CardFooter>
      {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
      {action.success ? <FeedbackBanner message={action.success} /> : null}
    </LoopCard>
  );
}
