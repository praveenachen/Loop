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
  return `${Math.floor(hours / 24)}d`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const [listing, ride, group, conversationLinks] = await Promise.all([
    db.marketplaceListing.findFirst({ orderBy: { createdAt: "desc" } }),
    db.rideListing.findFirst({ orderBy: { createdAt: "desc" } }),
    db.studyGroup.findFirst({ orderBy: { createdAt: "desc" } }),
    db.conversationParticipant.findMany({
      where: { userId: user.id },
      orderBy: { joinedAt: "desc" },
      take: 3,
      include: {
        conversation: {
          include: {
            participants: { include: { user: true } },
            messages: { orderBy: { createdAt: "desc" }, take: 1 }
          }
        }
      }
    })
  ]);

  const chats = await Promise.all(
    conversationLinks.map(async (link) => {
      const other = link.conversation.participants.find((participant) => participant.userId !== user.id)?.user;
      if (!other) return null;
      const latest = link.conversation.messages[0];
      const unread = await db.message.count({
        where: {
          conversationId: link.conversationId,
          createdAt: link.lastReadAt ? { gt: link.lastReadAt } : undefined,
          senderId: { not: user.id }
        }
      });

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

  const recentActivity = [
    listing
      ? {
          id: listing.id,
          label: "Marketplace",
          title: listing.title,
          detail: `${listing.category} - ${listing.location}`,
          href: "/marketplace"
        }
      : null,
    ride
      ? {
          id: ride.id,
          label: "Ride",
          title: ride.route,
          detail: `${ride.departure} - $${ride.pricePerSeat}/seat`,
          href: "/rides"
        }
      : null,
    group
      ? {
          id: group.id,
          label: "Study",
          title: `${group.course}: ${group.title}`,
          detail: `${group.schedule} - ${group.location}`,
          href: "/study-groups"
        }
      : null
  ].filter(Boolean);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      program: user.program,
      year: user.year,
      avatar: user.avatar,
      rating: user.rating,
      reviews: user.reviewsCount,
      verification: user.verificationLevel.toLowerCase(),
      completedTransactions: user.completedTransactions,
      ridesGiven: user.ridesGiven,
      groupsHosted: user.groupsHosted
    },
    recentActivity,
    chats: chats.filter((chat) => chat !== null)
  });
}
