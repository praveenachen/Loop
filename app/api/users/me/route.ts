import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/api";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  return NextResponse.json({
    id: user.id,
    email: user.email,
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
  });
}
