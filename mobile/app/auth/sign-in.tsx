import { useState, useRef } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheck,
  MessageCircle,
  Star,
  Sparkles,
} from "lucide-react-native";
import { FormScreen } from "../../components/FormScreen";
import { LoopInput } from "../../components/LoopInput";
import {
  LoopCard,
  LoopText,
  GooseImage,
  LoopButton,
  FeedbackBanner,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
import { colors, radius, shadows } from "../../theme";
export default function SignInScreen() {
  const { signIn } = useLoop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  async function submit() {
    if (lock.current) return;
    lock.current = true; setSubmitting(true); setError("");
    try { await signIn(email, password); setPassword(""); router.replace("/"); }
    catch (e) { setError((e as Error).message); }
    finally { lock.current = false; setSubmitting(false); }
  }
  return (
    <FormScreen>
      <LinearGradient
        colors={[
          "hsla(151, 63%, 40%, 0.2)",
          "hsla(47, 92%, 66%, 0.25)",
          "hsla(335, 75%, 58%, 0.2)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 24,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.stroke,
          gap: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <GooseImage goose="logoTransparent" size={48} />
          <LoopText variant="display">Loop</LoopText>
        </View>
        <LoopText variant="display">
          Your campus marketplace, rides, and study circle in one place.
        </LoopText>
        <LoopText>
          Sign in with your verified Waterloo account and jump back into your
          dashboard.
        </LoopText>
        <LoopText variant="label">Why Loop</LoopText>
        {[
          {
            label: "UW Verified Only",
            Icon: ShieldCheck,
            fill: "#7ef7c2",
            color: "#127f56",
          },
          {
            label: "In-App Messaging",
            Icon: MessageCircle,
            fill: "#8fd1ff",
            color: "#0c6fb7",
          },
          {
            label: "Ratings + History",
            Icon: Star,
            fill: "#ffe68a",
            color: "#8e6800",
          },
        ].map(({ label, Icon, fill, color }) => (
          <LoopCard key={label} style={{ padding: 16 }}>
            <View
              style={{
                height: 48,
                width: 48,
                borderRadius: 16,
                backgroundColor: fill,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon size={24} color={color} />
            </View>
            <LoopText variant="pill" style={{ color: colors.ink }}>
              {label}
            </LoopText>
          </LoopCard>
        ))}
        <View style={{ gap: 8, flexDirection: "row", flexWrap: "wrap" }}>
          {[
            {
              label: "Marketplace",
              fill: "hsla(151, 63%, 40%, 0.2)",
              color: colors.marketplace,
            },
            {
              label: "Rides",
              fill: "hsla(47, 92%, 66%, 0.4)",
              color: colors.ink,
            },
            {
              label: "Study-Pair",
              fill: "hsla(335, 75%, 58%, 0.2)",
              color: colors.study,
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                borderRadius: radius.pill,
                backgroundColor: item.fill,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <LoopText variant="pill" style={{ color: item.color }}>
                {item.label}
              </LoopText>
            </View>
          ))}
        </View>
      </LinearGradient>
      <LinearGradient
        colors={[colors.white, colors.surfaceSoft]}
        style={[
          shadows.lift,
          {
            padding: 24,
            gap: 12,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.stroke,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: colors.stroke,
              borderRadius: radius.pill,
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: colors.white,
            }}
          >
            <Sparkles size={14} color={colors.inkSoft} />
            <LoopText variant="label">Student Access</LoopText>
          </View>
          <GooseImage goose="backpack" size={56} />
        </View>
        <LoopText variant="display">Sign in to Loop</LoopText>
        <LoopText variant="smallBody">
          Use your @uwaterloo.ca credentials to enter the verified network.
        </LoopText>
        <LoopInput
          style={{ borderRadius: 20, paddingHorizontal: 16 }}
          label="Email"
          placeholder="name@uwaterloo.ca"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <LoopInput
          style={{ borderRadius: 20, paddingHorizontal: 16 }}
          label="Password"
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={submit}
        />
        {error ? <FeedbackBanner tone="error" message={error} /> : null}
        <LoopButton disabled={submitting} onPress={submit}>{submitting ? "Signing in…" : "Sign In"}</LoopButton>
        <LoopText variant="chip">
          Use your Loop student account.
        </LoopText>
        <LoopText variant="chip">
          Your session is stored securely on this device.
        </LoopText>
      </LinearGradient>
    </FormScreen>
  );
}
