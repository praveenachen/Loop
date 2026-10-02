import { Pressable, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { LoopText } from "./LoopText";
// Static pills remain compact; interactive pills have a 44px minimum target.
export function LoopPill({
  label,
  selected = false,
  onPress,
  icon,
  soft = true,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  soft?: boolean;
}) {
  const style = {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: selected ? colors.ink : colors.stroke,
    backgroundColor: selected
      ? colors.ink
      : soft
        ? colors.surfaceSoft
        : colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.compact,
    minHeight: onPress ? 44 : 32,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  };
  const content = (
    <>
      {icon}
      <LoopText
        variant="pill"
        style={{ color: selected ? colors.white : colors.inkSoft }}
      >
        {label}
      </LoopText>
    </>
  );
  return onPress ? (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [style, { opacity: pressed ? 0.75 : 1 }]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
