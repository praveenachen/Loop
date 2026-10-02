import type { ViewStyle } from "react-native";
// Native shadow approximation of Tailwind's negative-spread CSS shadows.
export const shadows: Record<"card" | "lift", ViewStyle> = {
  card: {
    shadowColor: "#12151a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  lift: {
    shadowColor: "#12151a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
};
