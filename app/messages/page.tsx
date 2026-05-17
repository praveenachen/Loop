 "use client";

import { useEffect, useState } from "react";
import { LockKeyhole, MessageSquare, Plus } from "lucide-react";

import { ChatPreviewCard } from "@/components/shared/chat-preview-card";
import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { Button } from "@/components/ui/button";
import { ChatPreview } from "@/types";

export default function MessagesPage() {
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
            <div key={chat.id} className="relative">
              <ChatPreviewCard chat={chat} />
            </div>
          ))}
        </div>
      </div>
    </LoopPageFrame>
  );
}
