import { View, type ViewProps } from "react-native";
import {
  colors,
  radius,
  shadows,
  spacing,
  toneColors,
  type Tone,
} from "../theme";
export function LoopCard({
  style,
  tone = "neutral",
  panel = false,
  ...props
}: ViewProps & { tone?: Tone; panel?: boolean }) {
  return (
    <View
      {...props}
      style={[
        shadows.card,
        {
          backgroundColor: colors.white,
          borderColor: toneColors[tone].border,
          borderWidth: 1,
          borderRadius: panel ? radius.panel : radius.card,
          padding: spacing.section,
          gap: spacing.control,
        },
        style,
      ]}
    />
  );
}
