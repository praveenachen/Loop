import { RideMode, RideSeatStatus } from "@prisma/client";
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
      const ride = await tx.rideListing.findUnique({ where: { id } });
      if (!ride) return { status: 404, error: "Ride not found." };
      if (ride.mode !== RideMode.OFFER) return { status: 400, error: "Seats can only be requested on ride offers." };
      if (ride.driverId === user.id) return { status: 400, error: "You cannot request a seat on your own ride." };

      const existing = await tx.rideSeatRequest.findUnique({
        where: { rideId_userId: { rideId: id, userId: user.id } }
      });
      if (existing) return { status: 200, id: existing.id, seats: ride.seats, alreadyRequested: true };

      const updated = await tx.rideListing.updateMany({
        where: { id, seats: { gt: 0 } },
        data: { seats: { decrement: 1 } }
      });
      if (updated.count === 0) return { status: 409, error: "This ride no longer has an open seat." };

      const seatRequest = await tx.rideSeatRequest.create({ data: { rideId: id, userId: user.id } });
      const currentRide = await tx.rideListing.findUniqueOrThrow({ where: { id }, select: { seats: true } });
      if (currentRide.seats === 0) {
        await tx.rideListing.update({ where: { id }, data: { seatStatus: RideSeatStatus.WAITLIST } });
      }

      return { status: 201, id: seatRequest.id, seats: currentRide.seats, alreadyRequested: false };
    }, { isolationLevel: "Serializable" });

    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json({ error: "The seat could not be requested. Please try again." }, { status: 409 });
  }
}
