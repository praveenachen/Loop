import { View } from "react-native";
import { CarFront, Handshake, Users } from "lucide-react-native";
import type { User } from "../lib/types";
import { colors, radius } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { VerificationBadge } from "./VerificationBadge";
import { RatingChip } from "./RatingChip";
import { Avatar } from "./CardParts";
export function ProfileSummaryCard({ user }: { user: User }) {
  return (
    <LoopCard>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <Avatar user={user} size={56} />
        <View style={{ flex: 1, minWidth: 120 }}>
          <LoopText variant="sectionHeading">{user.name}</LoopText>
          <LoopText variant="smallBody">
            {user.program} • {user.year}
          </LoopText>
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <VerificationBadge level={user.verification} />
        <RatingChip rating={user.rating} reviews={user.reviews} />
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
      {[
        {
          label: "Transactions",
          value: user.completedTransactions,
          Icon: Handshake,
        },
        { label: "Rides Given", value: user.ridesGiven, Icon: CarFront },
        { label: "Groups Hosted", value: user.groupsHosted, Icon: Users },
      ].map(({ label, value, Icon }) => (
        <View
          key={label}
          style={{
            flex: 1,
            aspectRatio: 1,
            padding: 8,
            borderRadius: radius.small,
            backgroundColor: colors.surfaceSoft,
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Icon size={18} color={colors.inkSoft} />
          <LoopText variant="sectionHeading" style={{ color: colors.ink }}>
            {value}
          </LoopText>
          <LoopText variant="meta" numberOfLines={2} style={{ textAlign: "center" }}>
            {label}
          </LoopText>
        </View>
      ))}
      </View>
    </LoopCard>
  );
}
