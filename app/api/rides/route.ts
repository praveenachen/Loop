import { RideMode, RideSeatStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { badRequest, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { rideCreateSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const rides = await db.rideListing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      driver: true,
      seatRequests: {
        where: { userId: user.id },
        select: { id: true }
      }
    }
  });

  return NextResponse.json(
    rides.map((ride) => ({
      id: ride.id,
      route: ride.route,
      departure: ride.departure,
      pricePerSeat: ride.pricePerSeat,
      seats: ride.seats,
      seatStatus: ride.seatStatus === RideSeatStatus.SEATS_OPEN ? "seats-open" : "waitlist",
      car: ride.car,
      mode: ride.mode.toLowerCase(),
      requestedByCurrentUser: ride.seatRequests.length > 0,
      isOwner: ride.driverId === user.id,
      driver: {
        id: ride.driver.id,
        name: ride.driver.name,
        program: ride.driver.program,
        year: ride.driver.year,
        avatar: ride.driver.avatar,
        rating: ride.driver.rating,
        reviews: ride.driver.reviewsCount,
        verification: ride.driver.verificationLevel.toLowerCase()
      }
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const payload = await req.json();
  const parsed = rideCreateSchema.safeParse(payload);
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid ride payload");

  const created = await db.rideListing.create({
    data: {
      driverId: user.id,
      route: parsed.data.route,
      departure: parsed.data.departure,
      pricePerSeat: parsed.data.pricePerSeat,
      seats: parsed.data.seats,
      car: parsed.data.car,
      mode: parsed.data.mode === "REQUEST" ? RideMode.REQUEST : RideMode.OFFER,
      seatStatus: parsed.data.seats > 0 ? RideSeatStatus.SEATS_OPEN : RideSeatStatus.WAITLIST
    }
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
