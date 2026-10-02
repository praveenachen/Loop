import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import { LoopText } from "./LoopText";
import { PressableScale } from "./PressableScale";
type Variant = "primary" | "secondary" | "marketplace" | "rides" | "study";
export function LoopButton({
  children,
  icon,
  variant = "primary",
  disabled,
  compact = false,
  style,
  ...props
}: Omit<PressableProps, "children" | "style"> & {
  style?: StyleProp<ViewStyle>;
  children: string;
  variant?: Variant;
  icon?: ReactNode;
  compact?: boolean;
}) {
  const backgroundColor =
    variant === "secondary"
      ? colors.white
      : variant === "primary"
        ? colors.ink
        : colors[variant];
  const color =
    variant === "secondary" || variant === "rides" ? colors.ink : colors.white;
  return (
    <PressableScale
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[
        {
          minHeight: compact ? 34 : 44,
          ...(compact ? { height: 34 } : null),
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor:
            variant === "secondary" ? colors.stroke : backgroundColor,
          backgroundColor,
          paddingHorizontal: compact ? 6 : spacing.base,
          paddingVertical: compact ? 4 : spacing.control,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon}
      <LoopText
        numberOfLines={1}
        style={[
          typography.pill,
          compact && { fontSize: 12, lineHeight: 15 },
          { color, flexShrink: 1, textAlign: "center" },
        ]}
      >
        {children}
      </LoopText>
    </PressableScale>
  );
}
