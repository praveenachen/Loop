import { ActivityIndicator, View } from "react-native";
import { CircleAlert, CircleCheck, Inbox } from "lucide-react-native";
import { colors, radius } from "../theme";
import { useLoop } from "../lib/AppProvider";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
export function LoadingState({
  label = "Loading",
  rows = 3,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <View style={{ gap: 12 }} accessibilityLiveRegion="polite">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <ActivityIndicator color={colors.inkSoft} />
        <LoopText variant="smallBody">{label}</LoopText>
      </View>
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={i}
          style={{
            height: 96,
            borderRadius: radius.small,
            borderWidth: 1,
            borderColor: colors.stroke,
            backgroundColor: colors.surfaceSoft,
          }}
        />
      ))}
    </View>
  );
}
export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={{ paddingVertical: 24, alignItems: "center", gap: 10 }}>
      <Inbox size={32} color={colors.inkSoft} />
      <LoopText variant="sectionHeading" style={{ textAlign: "center" }}>
        {title}
      </LoopText>
      <LoopText variant="smallBody" style={{ textAlign: "center" }}>
        {message}
      </LoopText>
    </View>
  );
}
export function ErrorState({
  message,
  onRetry,
  retrying = false,
}: {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
}) {
  return (
    <View
      accessibilityRole="alert"
      style={{
        padding: 16,
        gap: 12,
        borderRadius: radius.small,
        borderWidth: 1,
        borderColor: colors.studyBorder,
        backgroundColor: colors.studySoft,
      }}
    >
      <CircleAlert size={20} color={colors.study} />
      <LoopText variant="cardHeading">Something went wrong</LoopText>
      <LoopText variant="smallBody">{message}</LoopText>
      <LoopButton variant="secondary" disabled={retrying} onPress={onRetry}>
        {retrying ? "Retrying..." : "Try Again"}
      </LoopButton>
    </View>
  );
}
export function FeedbackBanner({
  message,
  tone = "success",
}: {
  message: string;
  tone?: "success" | "error";
}) {
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  const color = tone === "success" ? colors.trust : colors.study;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        padding: 12,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.small,
        borderWidth: 1,
        borderColor:
          tone === "success" ? colors.marketplaceBorder : colors.studyBorder,
        backgroundColor:
          tone === "success" ? colors.trustSoft : colors.studySoft,
      }}
    >
      <Icon size={16} color={color} />
      <LoopText variant="smallBody" style={{ color, flex: 1 }}>
        {message}
      </LoopText>
    </View>
  );
}
export function LoopLoadState() {
  const { loading, error, reload } = useLoop();
  return loading ? (
    <LoadingState label="Loading Loop..." rows={2} />
  ) : error ? (
    <ErrorState message={error} onRetry={reload} />
  ) : null;
}
