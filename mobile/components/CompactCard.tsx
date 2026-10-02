import type { ReactNode } from "react";
import { View } from "react-native";
import type { Tone } from "../theme";
import { LoopCard } from "./LoopCard";
// List-row layout: details spread across the left, status and action stacked on the right.
export function CompactCard({
  tone,
  left,
  right,
  below,
  rightWidth = 116,
}: {
  tone: Tone;
  left: ReactNode;
  right: ReactNode;
  below?: ReactNode;
  rightWidth?: number | "auto";
}) {
  return (
    <LoopCard tone={tone} style={{ padding: 14, gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center", minHeight: 62 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 2, justifyContent: "center" }}>{left}</View>
        <View
          style={{
            width: rightWidth,
            alignItems: "stretch",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {right}
        </View>
      </View>
      {below}
    </LoopCard>
  );
}
// Fixed-height slot above the action button so price (or spots left) lines up across every list card.
export function CardTopSlot({ children }: { children: ReactNode }) {
  return (
    <View style={{ height: 24, alignItems: "center", justifyContent: "center" }}>
      {children}
    </View>
  );
}
