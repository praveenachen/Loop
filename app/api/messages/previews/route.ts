import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();

  const links = await db.conversationParticipant.findMany({
    where: { userId: currentUser.id },
    include: {
      conversation: {
        include: {
          participants: {
            include: { user: true }
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      }
    },
    orderBy: { joinedAt: "desc" }
  });

  const previews = await Promise.all(
    links.map(async (link) => {
      const other = link.conversation.participants.find((p) => p.userId !== currentUser.id)?.user;
      if (!other) return null;

      const unread = await db.message.count({
        where: {
          conversationId: link.conversationId,
          createdAt: link.lastReadAt ? { gt: link.lastReadAt } : undefined,
          senderId: { not: currentUser.id }
        }
      });

      const latest = link.conversation.messages[0];

      return {
        id: link.conversation.id,
        with: {
          id: other.id,
          name: other.name,
          program: other.program,
          year: other.year,
          avatar: other.avatar,
          rating: other.rating,
          reviews: other.reviewsCount,
          verification: other.verificationLevel.toLowerCase(),
          completedTransactions: other.completedTransactions,
          ridesGiven: other.ridesGiven,
          groupsHosted: other.groupsHosted
        },
        context:
          link.conversation.contextType === "MARKETPLACE"
            ? "Marketplace"
            : link.conversation.contextType === "RIDE"
              ? "Ride Coordination"
              : link.conversation.contextType === "STUDY_GROUP"
                ? "Study Group"
                : "General",
        lastMessage: latest?.body ?? "No messages yet.",
        time: latest ? formatRelativeTime(latest.createdAt) : "now",
        unread
      };
    })
  );

  return NextResponse.json(previews.filter(Boolean));
}
