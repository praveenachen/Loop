import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { resetAndSeed } from "@/lib/dev-seed";
import { getCurrentUser } from "@/lib/server-auth";

const ALLOWED_RESET_EMAILS = new Set([
  "avery@uwaterloo.ca",
  "beta1@uwaterloo.ca",
  "beta2@uwaterloo.ca"
]);

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!ALLOWED_RESET_EMAILS.has(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await resetAndSeed(db);

  return NextResponse.json({ ok: true });
}
