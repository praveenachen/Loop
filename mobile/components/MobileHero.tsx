import type { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  radius,
  shadows,
  spacing,
  toneColors,
  type Tone,
} from "../theme";
import { GooseImage, type Goose } from "./GooseImage";
import { LoopText } from "./LoopText";
export interface MobileHeroProps {
  title: string;
  subtitle: string;
  goose: Goose;
  tone?: Tone;
  actions?: ReactNode;
}
export function MobileHero({
  title,
  subtitle,
  goose,
  tone = "neutral",
  actions,
}: MobileHeroProps) {
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 390 || fontScale > 1.2;
  return (
    <View
      style={[
        shadows.card,
        { borderRadius: radius.panel, backgroundColor: colors.white },
      ]}
    >
      <LinearGradient
        colors={[toneColors[tone].fill, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: spacing.section,
          borderRadius: radius.panel,
          borderWidth: 1,
          borderColor: colors.stroke,
          gap: spacing.base,
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: colors.white,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: colors.stroke,
          }}
        >
          <Sparkles size={14} color={colors.inkSoft} />
          <LoopText variant="label">Student-first</LoopText>
        </View>
        <View
          style={{
            flexDirection: stacked ? "column" : "row",
            alignItems: stacked ? "stretch" : "center",
            gap: spacing.control,
          }}
        >
          <View
            style={{
              flex: stacked ? undefined : 1,
              minWidth: 0,
              gap: spacing.compact,
            }}
          >
            <LoopText variant="pageHeading" accessibilityRole="header">
              {title}
            </LoopText>
            <LoopText>{subtitle}</LoopText>
          </View>
          <GooseImage
            goose={goose}
            size={stacked ? 124 : 96}
            style={stacked ? { alignSelf: "flex-end" } : undefined}
          />
        </View>
        {actions ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.compact,
            }}
          >
            {actions}
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
}
export const PageHeader = MobileHero;
