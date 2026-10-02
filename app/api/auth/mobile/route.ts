import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authenticateCredentials } from "@/lib/auth";
import { db } from "@/lib/db";
import { badRequest, unauthorized } from "@/lib/api";
export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  if (!payload) return badRequest("Enter your email and password.");
  const user = await authenticateCredentials(payload);
  if (!user) return unauthorized("Email or password is incorrect.");
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.mobileSession.create({ data: { userId: user.id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt } });
  return NextResponse.json({ token, expiresAt: expiresAt.toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
export async function DELETE() {
  const auth = (await headers()).get("authorization");
  if (auth?.startsWith("Bearer ")) await db.mobileSession.deleteMany({ where: { tokenHash: createHash("sha256").update(auth.slice(7)).digest("hex") } });
  return NextResponse.json({ ok: true });
}
