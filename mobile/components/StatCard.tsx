import type { ReactNode } from "react";
import { View } from "react-native";
import { subtleToneColors, type Tone } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: Tone;
}) {
  return (
    <LoopCard
      tone={tone}
      style={
        tone === "neutral"
          ? undefined
          : { backgroundColor: subtleToneColors[tone] }
      }
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <LoopText variant="label" style={{ flexShrink: 1 }}>
          {label}
        </LoopText>
        {icon}
      </View>
      <LoopText variant="display">{value}</LoopText>
      {hint ? <LoopText variant="smallBody">{hint}</LoopText> : null}
    </LoopCard>
  );
}
