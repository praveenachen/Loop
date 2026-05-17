import { Activity, CarFront, Handshake, Users } from "lucide-react";

import { RatingChip } from "@/components/ui/rating-chip";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { User } from "@/types";

interface ProfileSummaryCardProps {
  user: User;
}

export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-stroke bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-soft text-base font-semibold text-ink">
            {user.avatar}
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">{user.name}</h3>
            <p className="text-sm text-ink-soft">
              {user.program} • {user.year}
            </p>
          </div>
        </div>
        <VerificationBadge level={user.verification} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <RatingChip rating={user.rating} reviews={user.reviews} />
        <span className="rounded-full bg-trust/15 px-2.5 py-1 text-xs font-semibold text-trust">Verified Identity</span>
      </div>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-stroke bg-surface-soft p-3">
          <p className="inline-flex items-center gap-1 text-ink-soft">
            <Handshake className="h-3.5 w-3.5" /> Transactions
          </p>
          <p className="mt-1 font-semibold text-ink">{user.completedTransactions}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-surface-soft p-3">
          <p className="inline-flex items-center gap-1 text-ink-soft">
            <CarFront className="h-3.5 w-3.5" /> Rides Given
          </p>
          <p className="mt-1 font-semibold text-ink">{user.ridesGiven}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-surface-soft p-3">
          <p className="inline-flex items-center gap-1 text-ink-soft">
            <Users className="h-3.5 w-3.5" /> Groups Hosted
          </p>
          <p className="mt-1 font-semibold text-ink">{user.groupsHosted}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-ink-soft">
        <Activity className="h-3.5 w-3.5 text-accent" />
        Campus identity and transaction history are always visible to other members.
      </div>
    </article>
  );
}
