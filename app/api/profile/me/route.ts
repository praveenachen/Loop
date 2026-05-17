import { NextResponse } from "next/server";
import { z } from "zod";

import { badRequest, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(80),
  program: z.string().min(2).max(120),
  year: z.string().min(1).max(20),
  avatar: z.string().min(1).max(4)
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const reviews = await db.review.findMany({
    where: { subjectId: user.id },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  });

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
    reviews: reviews.map((review) => ({
      id: review.id,
      subject: review.subject,
      body: review.body,
      rating: review.rating,
      createdAt: review.createdAt.toISOString(),
      author: {
        id: review.author.id,
        name: review.author.name,
        program: review.author.program,
        year: review.author.year,
        avatar: review.author.avatar,
        rating: review.author.rating,
        reviews: review.author.reviewsCount,
        verification: review.author.verificationLevel.toLowerCase(),
        completedTransactions: review.author.completedTransactions,
        ridesGiven: review.author.ridesGiven,
        groupsHosted: review.author.groupsHosted
      }
    }))
  });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid profile payload");
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      program: parsed.data.program,
      year: parsed.data.year,
      avatar: parsed.data.avatar.toUpperCase()
    }
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    program: updated.program,
    year: updated.year,
    avatar: updated.avatar,
    rating: updated.rating,
    reviews: updated.reviewsCount,
    verification: updated.verificationLevel.toLowerCase(),
    completedTransactions: updated.completedTransactions,
    ridesGiven: updated.ridesGiven,
    groupsHosted: updated.groupsHosted
  });
}
