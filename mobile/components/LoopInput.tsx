import { TextInput, View, type TextInputProps } from "react-native";
import { colors, fonts, radius } from "../theme";
import { LoopText } from "./LoopText";
export function LoopInput({
  label,
  style,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <LoopText variant="pill" style={{ color: colors.ink }}>
        {label}
      </LoopText>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.inkSoft}
        style={[
          {
            minHeight: 44,
            borderRadius: radius.small,
            borderWidth: 1,
            borderColor: colors.stroke,
            backgroundColor: colors.white,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontFamily: fonts.semibold,
            fontSize: 14,
            color: colors.ink,
            ...(props.multiline
              ? { minHeight: 96, textAlignVertical: "top" as const }
              : {}),
          },
          style,
        ]}
      />
    </View>
  );
}
