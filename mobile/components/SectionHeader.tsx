import type { ReactNode } from "react";
import { View } from "react-native";
import { LoopText } from "./LoopText";
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, minWidth: 120, gap: 4 }}>
        <LoopText variant="sectionHeading" accessibilityRole="header">
          {title}
        </LoopText>
        {subtitle ? <LoopText variant="smallBody">{subtitle}</LoopText> : null}
      </View>
      {action ? <View style={{ minHeight: 26, justifyContent: "center" }}>{action}</View> : null}
    </View>
  );
}
