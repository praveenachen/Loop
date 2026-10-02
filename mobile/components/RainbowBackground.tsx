import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Muted rainbow wash. `vivid` is for hero screens; the default is a softer tint for the rest of the app.
const ombre = {
  marketplace: [151, 65, 52],
  rides: [47, 95, 58],
  study: [335, 80, 66],
} as const;
export function RainbowBackground({
  vivid = false,
  tone,
}: {
  vivid?: boolean;
  tone?: keyof typeof ombre;
}) {
  const a = vivid ? 0.55 : 0.38;
  if (tone && tone in ombre) {
    const [h, s, l] = ombre[tone];
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            `hsla(${h}, ${s}%, ${l}%, 0.75)`,
            `hsla(${h}, ${s}%, ${l + 12}%, 0.4)`,
            `hsla(${h}, ${s}%, ${l + 22}%, 0.14)`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[
          `hsla(335, 80%, 68%, ${a})`,
          `hsla(47, 92%, 66%, ${a})`,
          `hsla(151, 65%, 54%, ${a})`,
          `hsla(208, 85%, 64%, ${a})`,
          `hsla(270, 70%, 72%, ${a})`,
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
