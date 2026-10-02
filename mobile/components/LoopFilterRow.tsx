import { ScrollView } from "react-native";
import { LoopPill } from "./LoopPill";
import type { PillRowProps } from "./LoopTabs";
export function LoopFilterRow({ items, active, onChange }: PillRowProps) {
  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      nestedScrollEnabled
      alwaysBounceVertical={false}
      showsHorizontalScrollIndicator={false}
      style={{ width: "100%", maxWidth: "100%" }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
      accessibilityLabel="Filters"
    >
      {items.map((item) => (
        <LoopPill
          key={item}
          label={item}
          selected={item === active}
          onPress={() => onChange(item)}
        />
      ))}
    </ScrollView>
  );
}
