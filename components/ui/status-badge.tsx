import { ListingStatus, RideSeatStatus } from "@/types";
import { cn } from "@/lib/utils";

type BadgeStatus = ListingStatus | RideSeatStatus | "trusted";

const styles: Record<BadgeStatus, string> = {
  available: "bg-marketplace/15 text-marketplace",
  pending: "bg-warning/15 text-warning",
  sold: "bg-ink/10 text-ink-soft",
  "seats-open": "bg-marketplace/15 text-marketplace",
  waitlist: "bg-rides/25 text-ink",
  trusted: "bg-trust/15 text-trust"
};

const labels: Record<BadgeStatus, string> = {
  available: "Available",
  pending: "Pending",
  sold: "Sold",
  "seats-open": "Seats Open",
  waitlist: "Waitlist",
  trusted: "Trusted"
};

interface StatusBadgeProps {
  status: BadgeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
}
