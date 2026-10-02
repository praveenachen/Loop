import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import {
  colors,
  radius,
  shadows,
  toneColors,
  subtleToneColors,
  type Tone,
} from "../theme";
import { GooseImage, type Goose } from "./GooseImage";
import { LoopText } from "./LoopText";
export function ActionCard({
  title,
  description,
  tone,
  icon,
  cta,
  onPress,
  goose,
}: {
  title: string;
  description: string;
  tone: Tone;
  icon: ReactNode;
  cta?: string;
  onPress: () => void;
  goose?: Goose;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        shadows.card,
        {
          borderRadius: goose ? radius.feature : radius.card,
          backgroundColor: colors.white,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={
          goose
            ? [colors.white, colors.white]
            : [
                tone === "rides"
                  ? "hsla(47, 92%, 66%, 0.3)"
                  : toneColors[tone].fill,
                subtleToneColors[tone],
              ]
        }
        style={{
          padding: goose ? 16 : 20,
          borderRadius: goose ? radius.feature : radius.card,
          borderWidth: 1,
          borderColor: goose ? colors.stroke : toneColors[tone].border,
          gap: 12,
        }}
      >
        {goose ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              backgroundColor: colors.surfaceSoft,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: radius.pill,
            }}
          >
            {icon}
            <LoopText variant="label">Quick start</LoopText>
          </View>
        ) : (
          icon
        )}
        <LoopText variant={goose ? "sectionHeading" : "cardHeading"}>
          {title}
        </LoopText>
        <LoopText variant="smallBody">{description}</LoopText>
        {goose ? (
          <View
            style={{
              alignSelf: "center",
              width: 160,
              height: 160,
              borderRadius: radius.pill,
              backgroundColor:
                tone === "rides"
                  ? "hsla(47, 92%, 66%, 0.25)"
                  : toneColors[tone].fill,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GooseImage goose={goose} size={112} decorative />
          </View>
        ) : null}
        {cta ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <LoopText variant="pill" style={{ color: colors.ink }}>
              {cta}
            </LoopText>
            <ArrowRight size={16} color={colors.ink} />
          </View>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}
