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
  compact = false,
}: {
  title: string;
  description: string;
  tone: Tone;
  icon: ReactNode;
  cta?: string;
  onPress: () => void;
  goose?: Goose;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title} ${description}`}
        style={({ pressed }) => [
          shadows.card,
          {
            flex: 1,
            borderRadius: radius.card,
            backgroundColor: colors.white,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.white, colors.white]}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 6,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: toneColors[tone].border,
            alignItems: "center",
            gap: 6,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.pill,
              backgroundColor: tone === "rides" ? "hsla(47, 92%, 66%, 0.4)" : toneColors[tone].fill,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {goose ? <GooseImage goose={goose} size={44} decorative /> : icon}
          </View>
          <LoopText
            variant="pill"
            numberOfLines={2}
            style={{ color: colors.ink, textAlign: "center", fontSize: 13, lineHeight: 17 }}
          >
            {title}
          </LoopText>
        </LinearGradient>
      </Pressable>
    );
  }
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
          transform: [{ scale: pressed ? 0.985 : 1 }],
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
          padding: 16,
          borderRadius: goose ? radius.feature : radius.card,
          borderWidth: 1,
          borderColor: goose ? colors.stroke : toneColors[tone].border,
          gap: 10,
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
        <LoopText variant={goose ? "sectionHeading" : "cardHeading"} numberOfLines={2}>
          {title}
        </LoopText>
        <LoopText variant="smallBody" numberOfLines={2}>{description}</LoopText>
        {goose ? (
          <View
            style={{
              alignSelf: "center",
              width: 144,
              height: 144,
              borderRadius: radius.pill,
              backgroundColor:
                tone === "rides"
                  ? "hsla(47, 92%, 66%, 0.25)"
                  : toneColors[tone].fill,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GooseImage goose={goose} size={100} decorative />
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
