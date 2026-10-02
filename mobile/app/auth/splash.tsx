import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooseImage, LoopButton, LoopText, RainbowBackground } from "../../components";
import { colors, radius, shadows } from "../../theme";
export default function SplashScreen() {
  const pop = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.timing(reveal, { toValue: 1, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pop, bob, reveal]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <RainbowBackground vivid />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <Animated.View
          style={[
            shadows.lift,
            {
              width: 190,
              height: 190,
              borderRadius: radius.pill,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
              opacity: pop,
              transform: [
                { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
              ],
            },
          ]}
        >
          <GooseImage goose="logo" size={150} decorative />
        </Animated.View>
        <Animated.View
          style={{
            alignItems: "center",
            gap: 4,
            opacity: reveal,
            transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          }}
        >
          <LoopText variant="display" style={{ fontSize: 44, lineHeight: 52 }}>Loop</LoopText>
          <LoopText variant="smallBody">Your campus essentials, connected.</LoopText>
        </Animated.View>
      </View>
      <Animated.View style={{ padding: 24, opacity: reveal }}>
        <LoopButton onPress={() => router.replace("/auth/sign-in")}>Continue</LoopButton>
      </Animated.View>
    </SafeAreaView>
  );
}
