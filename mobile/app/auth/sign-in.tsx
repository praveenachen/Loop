import { useState, useRef } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
} from "lucide-react-native";
import { FormScreen } from "../../components/FormScreen";
import { LoopInput } from "../../components/LoopInput";
import {
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
    <FormScreen vivid center>
      <LinearGradient
        colors={["hsla(0, 0%, 100%, 0.94)", "hsla(45, 30%, 97%, 0.92)"]}
        style={[
          shadows.lift,
          {
            padding: 24,
            gap: 14,
            borderRadius: 28,
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
              borderColor: colors.accent,
              borderRadius: radius.pill,
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: colors.accent,
            }}
          >
            <Sparkles size={14} color={colors.white} />
            <LoopText variant="label" style={{ color: colors.white }}>Student Access</LoopText>
          </View>
          <GooseImage goose="backpack" size={72} />
        </View>
        <LoopText variant="display">Sign in to Loop</LoopText>
        <LoopText variant="smallBody">Use your @uwaterloo.ca account.</LoopText>
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
          Your session is stored securely on this device.
        </LoopText>
      </LinearGradient>
    </FormScreen>
  );
}
