import { Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { colors, radius } from "../theme";
export function BackButton({ fallback = "/" }: { fallback?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => {
        if (router.canGoBack()) router.back();
        else router.replace(fallback);
      }}
      style={({ pressed }) => ({
        height: 44,
        width: 44,
        borderWidth: 1,
        borderColor: colors.stroke,
        borderRadius: radius.button,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <ChevronLeft size={20} color={colors.ink} />
    </Pressable>
  );
}
