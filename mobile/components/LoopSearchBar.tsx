import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { colors, fonts, radius } from "../theme";

export function LoopSearchBar({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <View
      style={{
        minHeight: 48,
        width: "100%",
        maxWidth: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: colors.stroke,
        backgroundColor: colors.white,
        paddingHorizontal: 14,
      }}
    >
      <Search size={20} color={colors.inkSoft} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          minWidth: 0,
          flex: 1,
          paddingVertical: 12,
          fontFamily: fonts.semibold,
          fontSize: 15,
          color: colors.ink,
        }}
      />
      {value ? (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          style={({ pressed }) => ({
            opacity: pressed ? 0.65 : 1,
            transform: [{ scale: pressed ? 0.92 : 1 }],
          })}
        >
          <X size={18} color={colors.inkSoft} />
        </Pressable>
      ) : null}
    </View>
  );
}
