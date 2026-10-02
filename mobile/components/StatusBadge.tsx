import { View } from "react-native";
import type { ListingStatus, RideSeatStatus } from "../lib/types";
import { colors, radius } from "../theme";
import { LoopText } from "./LoopText";
const labels = {
  available: "Available",
  pending: "Pending",
  sold: "Sold",
  "seats-open": "Seats Open",
  waitlist: "Waitlist",
  trusted: "Trusted",
};
export function StatusBadge({
  status,
}: {
  status: ListingStatus | RideSeatStatus | "trusted";
}) {
  const color =
    status === "pending"
      ? colors.warning
      : status === "sold"
        ? colors.inkSoft
        : status === "waitlist"
          ? colors.ink
          : status === "trusted"
            ? colors.trust
            : colors.marketplace;
  const fill =
    status === "pending"
      ? colors.warningSoft
      : status === "sold"
        ? colors.surfaceSoft
        : status === "waitlist"
          ? colors.ridesSoft
          : status === "trusted"
            ? colors.trustSoft
            : colors.marketplaceSoft;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: radius.pill,
        backgroundColor: fill,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <LoopText variant="chip" style={{ color }}>
        {labels[status]}
      </LoopText>
    </View>
  );
}
