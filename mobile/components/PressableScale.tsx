import { useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// Shared press feedback for every tappable control: a quick, restrained scale + dim.
// Transform and opacity only, so a press never shifts layout. Disabled controls do not animate.
export const PRESS_SCALE = 0.975;
export const PRESS_DIM = 0.88;
const PRESS_IN_MS = 110;
const PRESS_OUT_MS = 160;
export function PressableScale({
  style,
  scaleTo = PRESS_SCALE,
  dimTo = PRESS_DIM,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  dimTo?: number;
}) {
  const press = useRef(new Animated.Value(0)).current;
  const animate = (toValue: number, duration: number) =>
    Animated.timing(press, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  // Resting opacity comes from the caller's style (for example 0.5 when disabled); the press dims relative to it.
  const resting = StyleSheet.flatten(style)?.opacity ?? 1;
  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        if (!disabled) animate(1, PRESS_IN_MS);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animate(0, PRESS_OUT_MS);
        onPressOut?.(e);
      }}
      style={[
        style,
        {
          opacity: press.interpolate({
            inputRange: [0, 1],
            outputRange: [resting as number, (resting as number) * dimTo],
          }),
          transform: [
            { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, scaleTo] }) },
          ],
        },
      ]}
    />
  );
}
