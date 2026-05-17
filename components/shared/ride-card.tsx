import { Car, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RatingChip } from "@/components/ui/rating-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { RideListing } from "@/types";
import { ListingCard } from "./listing-card";

interface RideCardProps {
  ride: RideListing;
}

export function RideCard({ ride }: RideCardProps) {
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
                <Users className="h-3.5 w-3.5" /> {ride.seats} seats left
              </span>
              <span className="inline-flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> {ride.driver.name}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Waterloo pickup
              </span>
            </div>
          </div>
          <Button variant="rides" size="sm">
            Request Seat
          </Button>
        </>
      }
    />
  );
}
