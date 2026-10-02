import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "../theme";
import { RainbowBackground } from "./RainbowBackground";
export function FormScreen({
  children,
  vivid = false,
  center = false,
}: {
  children: ReactNode;
  vivid?: boolean;
  center?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={center ? ["top", "left", "right", "bottom"] : ["left", "right", "bottom"]}
      style={{ flex: 1, width: "100%", overflow: "hidden", backgroundColor: colors.surface }}
    >
      <RainbowBackground vivid={vivid} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={center ? 0 : insets.top + 44}
      >
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          horizontal={false}
          directionalLockEnabled
          alwaysBounceHorizontal={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: "100%",
            maxWidth: "100%",
            padding: 16,
            paddingBottom: 24,
            gap: 16,
            ...(center ? { flexGrow: 1, justifyContent: "center" as const } : null),
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
