import { ConversationContextType } from "@prisma/client";
import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;

  const listing = await db.marketplaceListing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  if (listing.sellerId === user.id) {
    return NextResponse.json({ error: "You cannot message yourself about your own listing." }, { status: 400 });
  }

  const existing = await db.conversation.findFirst({
    where: {
      contextType: ConversationContextType.MARKETPLACE,
      contextId: id,
      AND: [
        { participants: { some: { userId: user.id } } },
        { participants: { some: { userId: listing.sellerId } } }
      ]
    }
  });
  if (existing) return NextResponse.json({ conversationId: existing.id, created: false });

  const conversation = await db.conversation.create({
    data: {
      contextType: ConversationContextType.MARKETPLACE,
      contextId: id,
      participants: {
        create: [{ userId: user.id }, { userId: listing.sellerId }]
      },
      messages: {
        create: {
          senderId: user.id,
          body: `Hi, I'm interested in ${listing.title}. Is it still available?`
        }
      }
    }
  });

  return NextResponse.json({ conversationId: conversation.id, created: true }, { status: 201 });
}
