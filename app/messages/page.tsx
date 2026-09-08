 "use client";

import { Suspense, useEffect, useState } from "react";
import { LockKeyhole, MessageSquare, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ChatPreviewCard } from "@/components/shared/chat-preview-card";
import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { Button } from "@/components/ui/button";
import { ChatPreview } from "@/types";

function MessagesContent() {
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversation");
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/messages/previews", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load chats");
        const data = (await res.json()) as ChatPreview[];
        setChats(data);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  useEffect(() => {
    if (!selectedConversationId || chats.length === 0) return;
    document.getElementById(`conversation-${selectedConversationId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [chats, selectedConversationId]);

  return (
    <LoopPageFrame
      title="Messages"
      subtitle="All pickups, rides, and study coordination stay in-app to keep trust and accountability visible."
      mascotSrc="/geese/goose-backpack.png"
      mascotAlt="Backpack goose mascot"
      tabs={["Inbox", "Marketplace", "Rides", "Study Groups"]}
      activeTab="Inbox"
      filters={["Unread", "Needs reply", "Today", "Pinned"]}
      tone="neutral"
      actions={
        <>
          <Button variant="secondary">
            <LockKeyhole className="mr-2 h-4 w-4" />
            Safety Log
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {selectedConversationId && chats.some((chat) => chat.id === selectedConversationId) ? (
          <p className="rounded-xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm font-semibold text-ink">
            Conversation selected. Your marketplace inquiry is ready.
          </p>
        ) : null}
        <div className="rounded-2xl border border-stroke bg-surface-soft p-4">
          <p className="inline-flex items-center gap-2 text-sm font-extrabold text-ink">
            <MessageSquare className="h-4 w-4 text-accent" />
            Student-only inbox
          </p>
          <p className="mt-1 text-sm text-ink-soft">Only verified users can start or continue conversations in Loop.</p>
        </div>
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading conversations...</p> : null}
        {!loading && chats.length === 0 ? (
          <p className="text-sm font-semibold text-ink-soft">No conversations yet. Create a ride/listing/group to start messaging.</p>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {chats.map((chat) => (
            <div key={chat.id} id={`conversation-${chat.id}`} className="relative scroll-mt-6">
              <ChatPreviewCard chat={chat} highlighted={chat.id === selectedConversationId} />
            </div>
          ))}
        </div>
      </div>
    </LoopPageFrame>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm font-semibold text-ink-soft">Loading conversations...</p>}>
      <MessagesContent />
    </Suspense>
  );
}
