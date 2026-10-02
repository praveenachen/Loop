import { View } from "react-native";
import { BadgeCheck, ShieldCheck } from "lucide-react-native";
import { colors, radius } from "../theme";
import { LoopText } from "./LoopText";
export type Verification = "verified" | "trusted" | "ambassador";
export function VerificationBadge({
  level = "verified",
}: {
  level?: Verification;
}) {
  const color =
    level === "verified"
      ? colors.accent
      : level === "trusted"
        ? colors.trust
        : colors.ink;
  const backgroundColor =
    level === "verified"
      ? colors.accentSoft
      : level === "trusted"
        ? colors.trustSoft
        : colors.ridesSoft;
  const Icon = level === "verified" ? ShieldCheck : BadgeCheck;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        borderRadius: radius.pill,
        backgroundColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Icon size={14} color={color} />
      <LoopText variant="chip" style={{ color }}>
        {level === "verified"
          ? "UW Verified"
          : level === "trusted"
            ? "Trusted Member"
            : "Campus Ambassador"}
      </LoopText>
    </View>
  );
}
