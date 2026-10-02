import { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka/600SemiBold";
import { Nunito_500Medium } from "@expo-google-fonts/nunito/500Medium";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito/600SemiBold";
import { Nunito_700Bold } from "@expo-google-fonts/nunito/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";
import { BackButton } from "../components/BackButton";
import { AppProvider, useLoop } from "../lib/AppProvider";
import { colors, fonts } from "../theme";
void SplashScreen.preventAutoHideAsync().catch(() => {});
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fredoka_600SemiBold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          color={colors.trust}
          accessibilityLabel="Loading Loop fonts"
        />
      </View>
    );
  if (error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          padding: 32,
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20, color: colors.ink }}>
          Loop’s fonts could not be loaded. Close and reopen the app to try
          again.
        </Text>
      </View>
    );
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <SessionStack />
      </AppProvider>
    </SafeAreaProvider>
  );
}
function SessionStack() {
  const { signedIn, restoring } = useLoop();
  if (restoring) return <View style={{ flex: 1, backgroundColor: colors.surface, justifyContent: "center" }}><ActivityIndicator color={colors.trust} /></View>;
  return <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.surface },
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.ink,
            headerLeft: () => <BackButton />,
            headerTitleStyle: { fontFamily: fonts.display },
          }}
        >
          <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ title: "Search Loop" }} />
          <Stack.Screen
            name="messages/[id]"
            options={{ title: "Conversation" }}
          />
          <Stack.Screen
            name="listings/[id]"
            options={{ title: "Marketplace Listing" }}
          />
          <Stack.Screen name="ride/[id]" options={{ title: "Ride Details" }} />
          <Stack.Screen name="groups/[id]" options={{ title: "Study Group" }} />
          {(
            [
              "forms/listing",
              "forms/ride",
              "forms/group",
              "forms/profile",
            ] as const
          ).map((name) => (
            <Stack.Screen
              key={name}
              name={name}
              options={{
                presentation: "fullScreenModal",
                title:
                  name === "forms/listing"
                    ? "Create Listing"
                    : name === "forms/ride"
                      ? "Plan a Trip"
                      : name === "forms/group"
                        ? "Create Group"
                        : "Edit Profile",
              }}
            />
          ))}
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
          <Stack.Screen name="safety" options={{ title: "Safety + Trust" }} />
          </Stack.Protected>
          <Stack.Protected guard={!signedIn}><Stack.Screen name="auth/sign-in" options={{ title: "Student Access" }} /></Stack.Protected>
        </Stack>;
}
