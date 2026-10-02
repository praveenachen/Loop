import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useLoop } from "../lib/AppProvider";
import type { ReactNode } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";
import { RainbowBackground } from "./RainbowBackground";
import { TabTopBar } from "./TabTopBar";
import { BackButton } from "./BackButton";
// Stack/tab headers own the top inset; the tab bar owns the home-indicator inset.
export function LoopScreen({
  children,
  tab = true,
  vivid = false,
  tone,
  bare = false,
}: {
  children: ReactNode;
  tab?: boolean;
  vivid?: boolean;
  bare?: boolean;
  tone?: "marketplace" | "rides" | "study" | "neutral";
}) {
  const { reload, signedIn } = useLoop();
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(useCallback(() => { if (signedIn) void reload(); }, [signedIn, reload]));
  return (
    <SafeAreaView
      edges={tab ? ["top", "left", "right"] : bare ? ["top", "left", "right", "bottom"] : ["left", "right", "bottom"]}
      style={{ flex: 1, width: "100%", overflow: "hidden", backgroundColor: colors.surface }}
    >
      <RainbowBackground vivid={vivid} tone={tone === "neutral" ? undefined : tone} />
      {tab ? <TabTopBar /> : null}
      {bare ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 6, alignItems: "flex-start" }}>
          <BackButton />
        </View>
      ) : null}
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        horizontal={false}
        directionalLockEnabled
        alwaysBounceHorizontal={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void reload().finally(() => setRefreshing(false)); }} tintColor={colors.trust} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          width: "100%",
          maxWidth: "100%",
          padding: spacing.base,
          paddingBottom: spacing.roomy,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: "100%", gap: spacing.section }}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
