import { useAction } from "../../lib/useAction";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { ArrowUp } from "lucide-react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  LoopText,
  LoopButton,
  EmptyState,
  LoadingState,
  ErrorState,
  FeedbackBanner,
  VerificationBadge,
} from "../../components";
import { Avatar } from "../../components/CardParts";
import { useLoop } from "../../lib/AppProvider";
import { formatMessageTime } from "../../lib/format";
import { BackButton } from "../../components/BackButton";
import { PressableScale } from "../../components/PressableScale";
import { colors, fonts, radius } from "../../theme";
export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, thread, mutate } = useLoop();
  const chat = data.chats.find((c) => c.id === id);
  const [draft, setDraft] = useState("");
  const scroll = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const action = useAction();
  const [loadingThread, setLoadingThread] = useState(true);
  const [threadError, setThreadError] = useState("");
  useEffect(() => {
    let active = true;
    const load = () => thread(id).then(() => { if (active) setThreadError(""); }).catch(e => { if (active) setThreadError(e.message); }).finally(() => { if (active) setLoadingThread(false); });
    void load(); const timer = setInterval(() => { void load(); }, 15000);
    return () => { active = false; clearInterval(timer); };
  }, [id, thread]);
  async function send() {
    const body = draft.trim(); if (!body) return;
    await action.run(async () => {
      await mutate(`/api/messages/${id}`, { body });
      setDraft(""); await thread(id);
    });
  }
  if (!chat)
    return (
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ flex: 1, width: "100%", overflow: "hidden", backgroundColor: colors.surface, padding: 16 }}
      >
        <EmptyState
          title="Conversation unavailable"
          message="This conversation is unavailable for your account."
        />
        <LoopButton onPress={() => router.replace("/messages")}>
          Back to Messages
        </LoopButton>
      </SafeAreaView>
    );
  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, width: "100%", overflow: "hidden", backgroundColor: colors.surface }}
    >
      <Stack.Screen
        options={{
          title: chat.with.name,
          headerLeft: () => <BackButton fallback="/messages" />,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 44}
      >
        <ScrollView
          ref={scroll}
          style={{ flex: 1, width: "100%" }}
          horizontal={false}
          directionalLockEnabled
          alwaysBounceHorizontal={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() =>
            scroll.current?.scrollToEnd({ animated: false })
          }
          contentContainerStyle={{ width: "100%", maxWidth: "100%", padding: 16, gap: 12 }}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center", maxWidth: "100%" }}>
            <Avatar user={chat.with} />
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <LoopText variant="smallBody" numberOfLines={2}>
                {chat.context} · {chat.detail}
              </LoopText>
              <VerificationBadge level={chat.with.verification} />
            </View>
          </View>
          {loadingThread ? <LoadingState label="Loading messages…" /> : threadError ? <ErrorState message={threadError} onRetry={() => { setLoadingThread(true); void thread(id).then(() => setThreadError("")).catch(e => setThreadError(e.message)).finally(() => setLoadingThread(false)); }} /> : chat.messages.length ? (
            chat.messages.map((m, i) => {
              const mine = m.sender === "self";
              const next = chat.messages[i + 1];
              const prev = chat.messages[i - 1];
              const lastInGroup = !next || next.sender !== m.sender;
              const firstInGroup = !prev || prev.sender !== m.sender;
              return (
                <View
                  key={m.id}
                  style={{
                    alignItems: mine ? "flex-end" : "flex-start",
                    marginTop: firstInGroup && i > 0 ? 8 : -8,
                  }}
                >
                  <View
                    style={{
                      maxWidth: "78%",
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      backgroundColor: mine ? colors.accent : colors.white,
                      borderWidth: mine ? 0 : 1,
                      borderColor: colors.stroke,
                      borderRadius: 20,
                      // Square off the corner nearest the sender on the last bubble, like a message tail.
                      ...(lastInGroup
                        ? mine
                          ? { borderBottomRightRadius: 6 }
                          : { borderBottomLeftRadius: 6 }
                        : null),
                    }}
                  >
                    <LoopText
                      variant="body"
                      style={{ fontSize: 16, lineHeight: 22, color: mine ? colors.white : colors.ink }}
                    >
                      {m.body}
                    </LoopText>
                  </View>
                  {lastInGroup ? (
                    <LoopText variant="meta" style={{ marginTop: 3, marginHorizontal: 6 }}>
                      {formatMessageTime(m.time)}
                    </LoopText>
                  ) : null}
                </View>
              );
            })
          ) : (
            <EmptyState
              title="Your marketplace inquiry is ready"
              message="Start coordinating your campus pickup here."
            />
          )}
        </ScrollView>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            gap: 6,
            borderTopWidth: 1,
            borderColor: colors.stroke,
            backgroundColor: colors.white,
          }}
        >
          {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
            <TextInput
              accessibilityLabel="Message"
              placeholder="Message"
              placeholderTextColor={colors.inkSoft}
              multiline
              maxLength={2000}
              value={draft}
              onChangeText={setDraft}
              style={{
                flex: 1,
                minHeight: 40,
                maxHeight: 120,
                paddingHorizontal: 16,
                paddingTop: Platform.OS === "ios" ? 10 : 8,
                paddingBottom: Platform.OS === "ios" ? 10 : 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.stroke,
                backgroundColor: colors.surface,
                color: colors.ink,
                fontFamily: fonts.body,
                fontSize: 16,
              }}
            />
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Send message"
              accessibilityState={{ disabled: action.busy || !draft.trim() }}
              disabled={action.busy || !draft.trim()}
              onPress={send}
              hitSlop={4}
              scaleTo={0.92}
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.pill,
                backgroundColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
                opacity: action.busy || !draft.trim() ? 0.4 : 1,
              }}
            >
              <ArrowUp size={20} color={colors.white} />
            </PressableScale>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
