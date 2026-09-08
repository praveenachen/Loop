import { NextRequest, NextResponse } from "next/server";

import { badRequest, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { studyGroupCreateSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const groups = await db.studyGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      host: true,
      members: {
        where: { userId: user.id },
        select: { id: true }
      }
    }
  });

  return NextResponse.json(
    groups.map((group) => ({
      id: group.id,
      course: group.course,
      title: group.title,
      schedule: group.schedule,
      location: group.location,
      seatsLeft: group.seatsLeft,
      focus: group.focus,
      joinedByCurrentUser: group.members.length > 0,
      isOwner: group.hostId === user.id,
      host: {
        id: group.host.id,
        name: group.host.name,
        program: group.host.program,
        year: group.host.year,
        avatar: group.host.avatar,
        rating: group.host.rating,
        reviews: group.host.reviewsCount,
        verification: group.host.verificationLevel.toLowerCase()
      }
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const payload = await req.json();
  const parsed = studyGroupCreateSchema.safeParse(payload);
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid study group payload");

  const created = await db.studyGroup.create({
    data: {
      hostId: user.id,
      course: parsed.data.course,
      title: parsed.data.title,
      schedule: parsed.data.schedule,
      location: parsed.data.location,
      seatsLeft: parsed.data.seatsLeft,
      focus: parsed.data.focus
    }
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
