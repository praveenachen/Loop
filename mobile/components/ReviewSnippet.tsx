import { View } from "react-native";
import { Quote } from "lucide-react-native";
import type { Review } from "../lib/types";
import { colors } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { RatingChip } from "./RatingChip";
export function ReviewSnippet({ review }: { review: Review }) {
  return (
    <LoopCard style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <View style={{ flex: 1, minWidth: 120 }}>
          <LoopText variant="pill" style={{ color: colors.ink }}>
            {review.subject}
          </LoopText>
          <LoopText variant="chip">
            {review.author.name} • {review.createdAt}
          </LoopText>
        </View>
        <RatingChip rating={review.rating} soft />
      </View>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <Quote size={14} color={colors.inkSoft} />
        <LoopText variant="smallBody" style={{ flex: 1 }}>
          {review.body}
        </LoopText>
      </View>
    </LoopCard>
  );
}
