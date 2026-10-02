import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import { PressableScale } from "./PressableScale";
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
  // Selection cross-fades colours instead of snapping.
  const sel = useRef(new Animated.Value(selected ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(sel, {
      toValue: selected ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [selected, sel]);
  const restingFill = soft ? colors.surfaceSoft : colors.white;
  const backgroundColor = sel.interpolate({ inputRange: [0, 1], outputRange: [restingFill, colors.ink] });
  const borderColor = sel.interpolate({ inputRange: [0, 1], outputRange: [colors.stroke, colors.ink] });
  const textColor = sel.interpolate({ inputRange: [0, 1], outputRange: [colors.inkSoft, colors.white] });
  const style = {
    borderRadius: radius.pill,
    borderWidth: 1,
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
      <Animated.Text numberOfLines={1} style={[typography.pill, { color: textColor }]}>
        {label}
      </Animated.Text>
    </>
  );
  return onPress ? (
    <PressableScale
      onPress={onPress}
      hitSlop={compact ? { top: 7, bottom: 7 } : undefined}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Animated.View style={[style, { backgroundColor, borderColor }]}>{content}</Animated.View>
    </PressableScale>
  ) : (
    <Animated.View style={[style, { backgroundColor, borderColor }]}>{content}</Animated.View>
  );
}
