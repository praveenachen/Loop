import { ScrollView } from "react-native";
import { LoopPill } from "./LoopPill";
export interface PillRowProps {
  items: readonly string[];
  active: string;
  onChange: (item: string) => void;
}
export function LoopTabs({ items, active, onChange }: PillRowProps) {
  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      nestedScrollEnabled
      alwaysBounceVertical={false}
      showsHorizontalScrollIndicator={false}
      style={{ width: "100%", maxWidth: "100%" }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
      accessibilityLabel="Page tabs"
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
