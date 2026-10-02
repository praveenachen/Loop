import { Text, type TextProps } from "react-native";
import { typography } from "../theme";
export function LoopText({
  variant = "body",
  style,
  ...props
}: TextProps & { variant?: keyof typeof typography }) {
  return <Text {...props} style={[typography[variant], style]} />;
}
