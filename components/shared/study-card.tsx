import { CalendarDays, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RatingChip } from "@/components/ui/rating-chip";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { StudyGroup } from "@/types";
import { ListingCard } from "./listing-card";

interface StudyCardProps {
  group: StudyGroup;
  actionPending?: boolean;
  onJoin?: (group: StudyGroup) => void;
}

export function StudyCard({ group, actionPending = false, onJoin }: StudyCardProps) {
  const actionLabel = group.isOwner
    ? "Your Group"
    : group.joinedByCurrentUser
      ? "Joined"
      : group.seatsLeft <= 0
        ? "Group Full"
        : actionPending
          ? "Joining..."
          : "Join Group";

  return (
    <ListingCard
      accent="study"
      title={`${group.course} • ${group.title}`}
      subtitle={group.schedule}
      description={group.focus}
      footer={
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RatingChip rating={group.host.rating} reviews={group.host.reviews} />
              <VerificationBadge level={group.host.verification} />
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {group.seatsLeft} spots left
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {group.schedule}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {group.location}
              </span>
            </div>
          </div>
          <Button
            variant="study"
            size="sm"
            disabled={group.isOwner || group.joinedByCurrentUser || group.seatsLeft <= 0 || actionPending}
            onClick={() => onJoin?.(group)}
          >
            {actionLabel}
          </Button>
        </>
      }
    />
  );
}
