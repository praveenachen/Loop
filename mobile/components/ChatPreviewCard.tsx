import { MessageCircle } from "lucide-react-native";
import { View } from "react-native";
import { router } from "expo-router";
import type { Conversation } from "../lib/types";
import { colors, radius } from "../theme";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { CardFooter, TrustRow, Avatar } from "./CardParts";
export function ChatPreviewCard({ chat }: { chat: Conversation }) {
  return (
    <LoopCard style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <Avatar user={chat.with} />
        <View style={{ flex: 1, gap: 2 }}>
          <LoopText variant="pill" style={{ color: colors.ink }}>
            {chat.with.name}
          </LoopText>
          <LoopText variant="chip">{chat.context}</LoopText>
          <LoopText variant="chip">{chat.detail}</LoopText>
        </View>
        <LoopText variant="chip">{chat.time}</LoopText>
      </View>
      <LoopText variant="smallBody">{chat.lastMessage}</LoopText>
      <CardFooter>
        <TrustRow user={chat.with} soft />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {chat.unread > 0 ? (
            <View
              accessibilityLabel={`${chat.unread} unread messages`}
              style={{
                borderRadius: radius.pill,
                backgroundColor: colors.accent,
                padding: 6,
              }}
            >
              <LoopText variant="chip" style={{ color: colors.white }}>
                {chat.unread}
              </LoopText>
            </View>
          ) : null}
          <LoopButton
            icon={<MessageCircle size={14} color={colors.ink} />}
            variant="secondary"
            accessibilityLabel={`Open conversation with ${chat.with.name}`}
            onPress={() => router.push(`/messages/${chat.id}`)}
          >
            Open
          </LoopButton>
        </View>
      </CardFooter>
    </LoopCard>
  );
}
