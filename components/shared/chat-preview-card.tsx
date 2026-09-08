import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { RatingChip } from "@/components/ui/rating-chip";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { cn } from "@/lib/utils";
import { ChatPreview } from "@/types";

interface ChatPreviewCardProps {
  chat: ChatPreview;
  highlighted?: boolean;
}

export function ChatPreviewCard({ chat, highlighted = false }: ChatPreviewCardProps) {
  return (
    <article className={cn(
      "rounded-2xl border bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift",
      highlighted ? "border-accent ring-2 ring-accent/25" : "border-stroke"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-soft text-sm font-semibold text-ink">
            {chat.with.avatar}
          </div>
          <div>
            <p className="font-semibold text-ink">{chat.with.name}</p>
            <p className="text-xs text-ink-soft">{chat.context}</p>
          </div>
        </div>
        <p className="text-xs font-medium text-ink-soft">{chat.time}</p>
      </div>
      <p className="mt-3 text-sm text-ink-soft">{chat.lastMessage}</p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-stroke pt-4">
        <div className="flex items-center gap-2">
          <RatingChip rating={chat.with.rating} className="bg-surface-soft text-ink" />
          <VerificationBadge level={chat.with.verification} />
        </div>
        <div className="flex items-center gap-2">
          {chat.unread > 0 ? (
            <span className={cn("rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-white")}>{chat.unread}</span>
          ) : null}
          <Link href={`/messages?conversation=${encodeURIComponent(chat.id)}`} className="inline-flex items-center gap-1 rounded-lg border border-stroke px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface-soft">
            <MessageCircle className="h-3.5 w-3.5" />
            {highlighted ? "Selected" : "Open"}
          </Link>
        </div>
      </div>
    </article>
  );
}
