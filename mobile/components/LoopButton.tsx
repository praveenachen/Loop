import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import { LoopText } from "./LoopText";
type Variant = "primary" | "secondary" | "marketplace" | "rides" | "study";
export function LoopButton({
  children,
  icon,
  variant = "primary",
  disabled,
  style,
  ...props
}: Omit<PressableProps, "children"> & {
  children: string;
  variant?: Variant;
  icon?: ReactNode;
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
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={(state) => [
        {
          minHeight: 44,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor:
            variant === "secondary" ? colors.stroke : backgroundColor,
          backgroundColor,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.control,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : state.pressed ? 0.75 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {icon}
      <LoopText style={[typography.pill, { color }]}>{children}</LoopText>
    </Pressable>
  );
}
