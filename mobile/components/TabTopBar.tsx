import { Text, View } from "react-native";
import { router } from "expo-router";
import { UserRound } from "lucide-react-native";
import { colors, fonts, radius } from "../theme";
import { GooseImage } from "./GooseImage";
import { PressableScale } from "./PressableScale";
// Transparent top bar so the rainbow background shows through on tab screens.
export function TabTopBar() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.pill,
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.stroke,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GooseImage goose="logo" size={34} decorative />
        </View>
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.ink }}>
          Loop
        </Text>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        onPress={() => router.push("/profile")}
        scaleTo={0.94}
        style={{
          height: 44,
          width: 44,
          borderRadius: radius.button,
          borderWidth: 1,
          borderColor: colors.stroke,
          backgroundColor: colors.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UserRound size={20} color={colors.ink} />
      </PressableScale>
    </View>
  );
}
