import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { colors, radius } from "../theme";
import { PressableScale } from "./PressableScale";
export function BackButton({ fallback = "/" }: { fallback?: string }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => {
        if (router.canGoBack()) router.back();
        else router.replace(fallback);
      }}
      scaleTo={0.94}
      style={{
        height: 44,
        width: 44,
        borderWidth: 1,
        borderColor: colors.stroke,
        borderRadius: radius.button,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ChevronLeft size={20} color={colors.ink} />
    </PressableScale>
  );
}
