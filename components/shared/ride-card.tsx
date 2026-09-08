import { Car, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RatingChip } from "@/components/ui/rating-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { RideListing } from "@/types";
import { ListingCard } from "./listing-card";

interface RideCardProps {
  ride: RideListing;
  actionPending?: boolean;
  onRequestSeat?: (ride: RideListing) => void;
}

export function RideCard({ ride, actionPending = false, onRequestSeat }: RideCardProps) {
  const isRideRequest = ride.mode === "request";
  const unavailable = ride.seats <= 0 || ride.seatStatus === "waitlist";
  const actionLabel = isRideRequest
    ? "Ride Requested"
    : ride.isOwner
    ? "Your Ride"
    : ride.requestedByCurrentUser
      ? "Seat Requested"
      : unavailable
        ? "Ride Full"
        : actionPending
          ? "Requesting..."
          : "Request Seat";

  return (
    <ListingCard
      accent="rides"
      title={ride.route}
      subtitle={`${ride.departure} • $${ride.pricePerSeat}/seat`}
      description={`${ride.car} • Pickup coordinated in-app. Verified students only.`}
      meta={<StatusBadge status={ride.seatStatus} />}
      footer={
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RatingChip rating={ride.driver.rating} reviews={ride.driver.reviews} />
              <VerificationBadge level={ride.driver.verification} />
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {isRideRequest ? "Looking for a driver" : `${ride.seats} seats left`}
              </span>
              <span className="inline-flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> {ride.driver.name}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Waterloo pickup
              </span>
            </div>
          </div>
          <Button
            variant="rides"
            size="sm"
            disabled={isRideRequest || ride.isOwner || ride.requestedByCurrentUser || unavailable || actionPending}
            onClick={() => onRequestSeat?.(ride)}
          >
            {actionLabel}
          </Button>
        </>
      }
    />
  );
}
