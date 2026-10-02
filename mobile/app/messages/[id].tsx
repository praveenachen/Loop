import { useAction } from "../../lib/useAction";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  LoopCard,
  LoopText,
  LoopButton,
  EmptyState,
  LoadingState,
  ErrorState,
  FeedbackBanner,
  VerificationBadge,
} from "../../components";
import { LoopInput } from "../../components/LoopInput";
import { Avatar } from "../../components/CardParts";
import { useLoop } from "../../lib/AppProvider";
import { BackButton } from "../../components/BackButton";
import { colors, radius } from "../../theme";
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
        style={{ flex: 1, backgroundColor: colors.surface, padding: 16 }}
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
      style={{ flex: 1, backgroundColor: colors.surface }}
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() =>
            scroll.current?.scrollToEnd({ animated: false })
          }
          contentContainerStyle={{ padding: 16, gap: 16 }}
        >
          <LoopCard style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Avatar user={chat.with} />
              <View style={{ flex: 1, gap: 4 }}>
                <LoopText variant="cardHeading">{chat.with.name}</LoopText>
                <LoopText variant="smallBody">
                  {chat.context} · {chat.detail}
                </LoopText>
                <VerificationBadge level={chat.with.verification} />
              </View>
            </View>
          </LoopCard>
          <LoopText variant="chip" style={{ textAlign: "center" }}>
            Student-only coordination
          </LoopText>
          {loadingThread ? <LoadingState label="Loading messages…" /> : threadError ? <ErrorState message={threadError} onRetry={() => { setLoadingThread(true); void thread(id).then(() => setThreadError("")).catch(e => setThreadError(e.message)).finally(() => setLoadingThread(false)); }} /> : chat.messages.length ? (
            chat.messages.map((m) => (
              <LoopCard
                key={m.id}
                style={{
                  padding: 16,
                  backgroundColor:
                    m.sender === "self" ? colors.surfaceSoft : colors.white,
                  borderRadius: radius.card,
                }}
              >
                <LoopText variant="chip">
                  {m.sender === "self" ? data.user.name : chat.with.name} ·{" "}
                  {m.time}
                </LoopText>
                <LoopText variant="smallBody" style={{ color: colors.ink }}>
                  {m.body}
                </LoopText>
              </LoopCard>
            ))
          ) : (
            <EmptyState
              title="Your marketplace inquiry is ready"
              message="Start coordinating your campus pickup here."
            />
          )}
        </ScrollView>
        <View
          style={{
            padding: 16,
            gap: 8,
            borderTopWidth: 1,
            borderColor: colors.stroke,
            backgroundColor: colors.white,
          }}
        >
          <LoopInput
            label="Message"
            placeholder="Coordinate in Loop..."
            multiline
            maxLength={2000}
            value={draft}
            onChangeText={setDraft}
            style={{ minHeight: 48, maxHeight: 120 }}
          />
          {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
          <LoopButton disabled={action.busy || !draft.trim()} onPress={send}>
            Send
          </LoopButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
