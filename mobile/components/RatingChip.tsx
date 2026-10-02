import { View } from "react-native";
import { Star } from "lucide-react-native";
import { colors, radius } from "../theme";
import { LoopText } from "./LoopText";
export function RatingChip({
  rating,
  reviews,
  soft = false,
}: {
  rating: number;
  reviews?: number;
  soft?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        borderRadius: radius.pill,
        backgroundColor: soft ? colors.surfaceSoft : colors.ink,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Star
        size={14}
        color={soft ? colors.ink : colors.white}
        fill={soft ? colors.ink : colors.white}
      />
      <LoopText
        variant="chip"
        style={{ color: soft ? colors.ink : colors.white }}
      >
        {rating.toFixed(1)}
        {reviews !== undefined ? ` (${reviews})` : ""}
      </LoopText>
    </View>
  );
}
