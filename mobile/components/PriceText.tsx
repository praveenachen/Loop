import { Text } from "react-native";
import { colors, fonts } from "../theme";
import { LoopText } from "./LoopText";
// One price style for every list card: fixed size, never auto-shrunk, so prices read the same everywhere.
export function PriceText({ amount, unit, prefix }: { amount: number; unit?: string; prefix?: string }) {
  return (
    <LoopText
      numberOfLines={1}
      style={{
        fontFamily: fonts.display,
        fontSize: 20,
        lineHeight: 24,
        color: colors.ink,
        textAlign: "center",
      }}
    >
      {prefix ? (
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.inkSoft }}>
          {prefix}
        </Text>
      ) : null}
      ${amount}
      {unit ? (
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.inkSoft }}>
          {unit}
        </Text>
      ) : null}
    </LoopText>
  );
}
