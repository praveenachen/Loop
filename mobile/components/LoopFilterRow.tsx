import { ScrollView } from "react-native";
import { LoopCard } from "./LoopCard";
import { LoopPill } from "./LoopPill";
import type { PillRowProps } from "./LoopTabs";
export function LoopFilterRow({ items, active, onChange }: PillRowProps) {
  return (
    <LoopCard panel style={{ padding: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
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
    </LoopCard>
  );
}
