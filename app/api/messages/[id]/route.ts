import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { badRequest, unauthorized } from "@/lib/api";
type Context = { params: Promise<{ id: string }> };
export async function GET(_req: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const link = await db.conversationParticipant.findUnique({ where: { conversationId_userId: { conversationId: id, userId: user.id } } });
  if (!link) return NextResponse.json({ error: "Conversation unavailable." }, { status: 404 });
  const messages = await db.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: "desc" }, take: 200 });
  // Mark only fetched messages as read, so concurrent incoming messages remain unread.
  if (messages[0]) await db.conversationParticipant.update({ where: { id: link.id }, data: { lastReadAt: messages[0].createdAt } });
  return NextResponse.json(messages.reverse().map(m => ({ id: m.id, body: m.body, sender: m.senderId === user.id ? "self" : "other", time: m.createdAt.toISOString() })));
}
export async function POST(req: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const link = await db.conversationParticipant.findUnique({ where: { conversationId_userId: { conversationId: id, userId: user.id } } });
  if (!link) return NextResponse.json({ error: "Conversation unavailable." }, { status: 404 });
  const parsed = z.object({ body: z.string().trim().min(1).max(2000) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Message must contain 1–2000 characters.");
  const message = await db.$transaction(async tx => {
    const message = await tx.message.create({ data: { conversationId: id, senderId: user.id, body: parsed.data.body } });
    await tx.conversation.update({ where: { id }, data: { updatedAt: message.createdAt } });
    return message;
  });
  return NextResponse.json({ id: message.id }, { status: 201 });
}
