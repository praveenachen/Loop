import { View } from "react-native";
import { Activity, CarFront, Handshake, Users } from "lucide-react-native";
import type { User } from "../lib/types";
import { colors, radius } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { VerificationBadge } from "./VerificationBadge";
import { RatingChip } from "./RatingChip";
import { Avatar, MetaLine } from "./CardParts";
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
        <VerificationBadge level={user.verification} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <RatingChip rating={user.rating} reviews={user.reviews} />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: radius.pill,
            backgroundColor: colors.trustSoft,
          }}
        >
          <LoopText variant="chip" style={{ color: colors.trust }}>
            Verified Identity
          </LoopText>
        </View>
      </View>
      {[
        {
          label: "Transactions",
          value: user.completedTransactions,
          Icon: Handshake,
        },
        { label: "Rides Given", value: user.ridesGiven, Icon: CarFront },
        { label: "Groups Hosted", value: user.groupsHosted, Icon: Users },
      ].map(({ label, value, Icon }) => (
        <LoopCard
          key={label}
          style={{
            padding: 12,
            borderRadius: radius.small,
            backgroundColor: colors.surfaceSoft,
          }}
        >
          <MetaLine icon={<Icon size={14} color={colors.inkSoft} />}>
            {label}
          </MetaLine>
          <LoopText variant="pill" style={{ color: colors.ink }}>
            {value}
          </LoopText>
        </LoopCard>
      ))}
      <MetaLine icon={<Activity size={14} color={colors.accent} />}>
        Campus identity and transaction history are always visible to other
        members.
      </MetaLine>
    </LoopCard>
  );
}
