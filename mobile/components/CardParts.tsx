import type { ReactNode } from "react";
import { View } from "react-native";
import { colors } from "../theme";
import type { User } from "../lib/types";
import { RatingChip } from "./RatingChip";
import { VerificationBadge } from "./VerificationBadge";
import { LoopText } from "./LoopText";
export function CardFooter({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderColor: colors.stroke,
        paddingTop: 16,
        gap: 12,
      }}
    >
      {children}
    </View>
  );
}
export function TrustRow({
  user,
  soft = false,
}: {
  user: User;
  soft?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, maxWidth: "100%" }}>
      <RatingChip
        rating={user.rating}
        reviews={soft ? undefined : user.reviews}
        soft={soft}
      />
      <VerificationBadge level={user.verification} />
    </View>
  );
}
export function MetaLine({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, maxWidth: "100%" }}>
      {icon}
      <LoopText variant="chip" style={{ flexShrink: 1 }}>
        {children}
      </LoopText>
    </View>
  );
}
export function Avatar({ user, size = 40 }: { user: User; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size === 40 ? 12 : 16,
        backgroundColor: colors.surfaceSoft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoopText variant="pill" style={{ color: colors.ink }}>
        {user.avatar}
      </LoopText>
    </View>
  );
}
