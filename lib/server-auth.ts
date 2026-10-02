import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const authorization = (await headers()).get("authorization");
  if (authorization) {
    if (!authorization.startsWith("Bearer ")) return null;
    const token = authorization.slice(7);
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const session = await db.mobileSession.findUnique({
      where: { tokenHash: createHash("sha256").update(token).digest("hex") },
      include: { user: true }
    });
    return session && session.expiresAt > new Date() ? session.user : null;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return db.user.findUnique({
    where: { id: session.user.id }
  });
}
