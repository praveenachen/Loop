import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useLoop } from "../lib/AppProvider";
import type { ReactNode } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";
// Stack/tab headers own the top inset; the tab bar owns the home-indicator inset.
export function LoopScreen({
  children,
  tab = true,
}: {
  children: ReactNode;
  tab?: boolean;
}) {
  const { reload, signedIn } = useLoop();
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(useCallback(() => { if (signedIn) void reload(); }, [signedIn, reload]));
  return (
    <SafeAreaView
      edges={tab ? ["left", "right"] : ["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.surface }}
    >
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void reload().finally(() => setRefreshing(false)); }} tintColor={colors.trust} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          padding: spacing.base,
          paddingBottom: spacing.roomy,
          gap: spacing.section,
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
