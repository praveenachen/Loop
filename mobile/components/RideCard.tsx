import { useAction } from "../lib/useAction";
import { FeedbackBanner } from "./AsyncState";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Car, MapPin, Users } from "lucide-react-native";
import type { RideListing } from "../lib/types";
import { useLoop } from "../lib/AppProvider";
import { colors } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { StatusBadge } from "./StatusBadge";
import { CardFooter, TrustRow, MetaLine } from "./CardParts";
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
  return (
    <LoopCard tone="rides">
      {detail ? (
        <LoopText variant="cardHeading">{ride.route}</LoopText>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ride: ${ride.route}`}
          onPress={() => router.push(`/ride/${ride.id}`)}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <LoopText variant="cardHeading">{ride.route}</LoopText>
        </Pressable>
      )}
      <StatusBadge status={ride.seatStatus} />
      <LoopText variant="smallBody">
        {ride.departure} • ${ride.pricePerSeat}/seat
      </LoopText>
      <LoopText variant="smallBody">
        {ride.car} • Pickup coordinated in-app. Verified students only.
      </LoopText>
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
        <MetaLine icon={<MapPin size={14} color={colors.inkSoft} />}>
          Waterloo pickup
        </MetaLine>
        <LoopButton
          variant="rides"
          disabled={
            action.busy || ride.mode === "request" ||
            ride.isOwner ||
            ride.requestedByCurrentUser ||
            unavailable
          }
          onPress={() => { void action.run(() => mutate(`/api/rides/${ride.id}/request-seat`), "Seat requested successfully."); }}
        >
          {label}
        </LoopButton>
      </CardFooter>
      {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
      {action.success ? <FeedbackBanner message={action.success} /> : null}
    </LoopCard>
  );
}
