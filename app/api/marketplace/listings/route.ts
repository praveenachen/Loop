import { MarketplaceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { badRequest, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { marketplaceCreateSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const listings = await db.marketplaceListing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: true
    }
  });

  const contacted = await db.conversation.findMany({
    where: {
      contextType: "MARKETPLACE",
      contextId: { in: listings.map((item) => item.id) },
      participants: { some: { userId: user.id } }
    },
    select: { contextId: true }
  });
  const contactedIds = new Set(contacted.map((conversation) => conversation.contextId));

  return NextResponse.json(
    listings.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      postedAt: item.postedAt,
      location: item.location,
      category: item.category,
      status: item.status.toLowerCase(),
      contactedByCurrentUser: contactedIds.has(item.id),
      isOwner: item.sellerId === user.id,
      seller: {
        id: item.seller.id,
        name: item.seller.name,
        program: item.seller.program,
        year: item.seller.year,
        avatar: item.seller.avatar,
        rating: item.seller.rating,
        reviews: item.seller.reviewsCount,
        verification: item.seller.verificationLevel.toLowerCase()
      }
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const payload = await req.json();
  const parsed = marketplaceCreateSchema.safeParse(payload);
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid marketplace payload");

  const created = await db.marketplaceListing.create({
    data: {
      sellerId: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      postedAt: "just now",
      location: parsed.data.location,
      category: parsed.data.category,
      status: MarketplaceStatus.AVAILABLE
    }
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
