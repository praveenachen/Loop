import { ScrollView } from "react-native";
import { LoopCard } from "./LoopCard";
import { LoopPill } from "./LoopPill";
export interface PillRowProps {
  items: readonly string[];
  active: string;
  onChange: (item: string) => void;
}
export function LoopTabs({ items, active, onChange }: PillRowProps) {
  return (
    <LoopCard panel style={{ padding: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
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
    </LoopCard>
  );
}
