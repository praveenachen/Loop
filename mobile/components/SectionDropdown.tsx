import { useRef, useState } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { colors, radius, shadows } from "../theme";
import { LoopText } from "./LoopText";
// Compact dropdown that replaces the page-level tab pills; the menu opens anchored under the button.
export function SectionDropdown({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const open = () =>
    ref.current?.measureInWindow((x, y, w, h) => {
      const winWidth = Dimensions.get("window").width;
      setAnchor({ top: y + h + 6, right: Math.max(winWidth - (x + w), 12) });
    });
  return (
    <>
      <Pressable
        ref={ref}
        onPress={open}
        accessibilityRole="button"
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        accessibilityLabel={`Filter: ${value}`}
        accessibilityState={{ expanded: !!anchor }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 4,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <LoopText variant="pill" numberOfLines={1} style={{ color: colors.ink, lineHeight: 21 }}>
          {value}
        </LoopText>
        <ChevronDown size={16} color={colors.ink} />
      </Pressable>
      <Modal transparent visible={!!anchor} animationType="fade" onRequestClose={() => setAnchor(null)}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setAnchor(null)}
          accessibilityLabel="Close menu"
        >
          {anchor ? (
            <View
              style={[
                shadows.lift,
                {
                  position: "absolute",
                  top: anchor.top,
                  right: anchor.right,
                  minWidth: 180,
                  backgroundColor: colors.white,
                  borderRadius: radius.card,
                  borderWidth: 1,
                  borderColor: colors.stroke,
                  paddingVertical: 6,
                },
              ]}
            >
              {options.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: option === value }}
                  onPress={() => {
                    setAnchor(null);
                    onChange(option);
                  }}
                  style={({ pressed }) => ({
                    minHeight: 44,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    paddingHorizontal: 16,
                    backgroundColor: pressed ? colors.surfaceSoft : "transparent",
                  })}
                >
                  <LoopText variant="pill" style={{ color: colors.ink }}>
                    {option}
                  </LoopText>
                  {option === value ? <Check size={16} color={colors.ink} /> : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}
