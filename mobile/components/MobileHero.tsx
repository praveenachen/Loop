import type { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  radius,
  shadows,
  spacing,
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
  large?: boolean;
}
export function MobileHero({
  title,
  subtitle,
  goose,
  actions,
  large = false,
}: MobileHeroProps) {
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 390 || fontScale > 1.2;
  return (
    <View
      style={[
        shadows.card,
        { borderRadius: radius.panel, backgroundColor: colors.white },
      ]}
    >
      <LinearGradient
        colors={[colors.white, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: spacing.section,
          borderRadius: radius.panel,
          borderWidth: 1,
          borderColor: colors.stroke,
          gap: spacing.control,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.control,
            width: "100%",
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: 0,
              gap: spacing.tiny,
            }}
          >
            <LoopText
              variant="pageHeading"
              accessibilityRole="header"
              numberOfLines={2}
              style={large ? { fontSize: 32, lineHeight: 38 } : undefined}
            >
              {title}
            </LoopText>
            <LoopText
              variant="smallBody"
              numberOfLines={3}
              style={large ? { fontSize: 15, lineHeight: 22 } : undefined}
            >
              {subtitle}
            </LoopText>
          </View>
          <GooseImage
            goose={goose}
            size={large ? (compact ? 96 : 116) : compact ? 64 : 78}
            style={{ flexShrink: 0 }}
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
