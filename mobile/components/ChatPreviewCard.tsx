import { MessageCircle } from "lucide-react-native";
import { View } from "react-native";
import { router } from "expo-router";
import type { Conversation } from "../lib/types";
import { colors, radius } from "../theme";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { CompactCard } from "./CompactCard";
function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View
      accessibilityLabel={`${count} unread messages`}
      style={{
        alignSelf: "flex-start",
        borderRadius: radius.pill,
        backgroundColor: colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      <LoopText variant="meta" style={{ color: colors.white }}>
        {count} new
      </LoopText>
    </View>
  );
}
export function ChatPreviewCard({ chat }: { chat: Conversation }) {
  return (
    <CompactCard
      tone="marketplace"
      rightWidth={84}
      left={
        <>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <LoopText
              variant="cardHeading"
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {chat.with.name}
            </LoopText>
            <UnreadBadge count={chat.unread} />
          </View>
          <LoopText variant="eyebrow" numberOfLines={1}>
            {chat.context} · {chat.time}
          </LoopText>
          <LoopText variant="cardBody" numberOfLines={2}>
            {chat.lastMessage}
          </LoopText>
        </>
      }
      right={
        <LoopButton
          compact
          icon={<MessageCircle size={13} color={colors.white} />}
          variant="marketplace"
          accessibilityLabel={`Open conversation with ${chat.with.name}`}
          onPress={() => router.push(`/messages/${chat.id}`)}
        >
          Open
        </LoopButton>
      }
    />
  );
}
