import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;

  try {
    const result = await db.$transaction(async (tx) => {
      const group = await tx.studyGroup.findUnique({ where: { id } });
      if (!group) return { status: 404, error: "Study group not found." };
      if (group.hostId === user.id) return { status: 400, error: "You already host this study group." };

      const existing = await tx.studyGroupMember.findUnique({
        where: { groupId_userId: { groupId: id, userId: user.id } }
      });
      if (existing) return { status: 200, id: existing.id, seatsLeft: group.seatsLeft, alreadyJoined: true };

      const updated = await tx.studyGroup.updateMany({
        where: { id, seatsLeft: { gt: 0 } },
        data: { seatsLeft: { decrement: 1 } }
      });
      if (updated.count === 0) return { status: 409, error: "This study group is full." };

      const membership = await tx.studyGroupMember.create({ data: { groupId: id, userId: user.id } });
      const currentGroup = await tx.studyGroup.findUniqueOrThrow({ where: { id }, select: { seatsLeft: true } });
      return { status: 201, id: membership.id, seatsLeft: currentGroup.seatsLeft, alreadyJoined: false };
    }, { isolationLevel: "Serializable" });

    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json({ error: "The group could not be joined. Please try again." }, { status: 409 });
  }
}
