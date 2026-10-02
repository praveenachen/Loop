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
  compact = false,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  soft?: boolean;
  compact?: boolean;
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
    paddingHorizontal: compact ? 22 : spacing.base,
    paddingVertical: compact ? 3 : spacing.compact,
    minHeight: compact ? 30 : onPress ? 44 : 32,
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
        numberOfLines={1}
        style={{ color: selected ? colors.white : colors.inkSoft }}
      >
        {label}
      </LoopText>
    </>
  );
  return onPress ? (
    <Pressable
      onPress={onPress}
      hitSlop={compact ? { top: 7, bottom: 7 } : undefined}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        style,
        {
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
