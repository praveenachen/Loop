import { BadgeCheck, ShieldCheck } from "lucide-react";

import { VerificationLevel } from "@/types";
import { cn } from "@/lib/utils";

const labels: Record<VerificationLevel, string> = {
  verified: "UW Verified",
  trusted: "Trusted Member",
  ambassador: "Campus Ambassador"
};

const styles: Record<VerificationLevel, string> = {
  verified: "bg-accent/15 text-accent",
  trusted: "bg-trust/15 text-trust",
  ambassador: "bg-rides/35 text-ink"
};

interface VerificationBadgeProps {
  level: VerificationLevel;
  className?: string;
}

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[level],
        className
      )}
    >
      {level === "verified" ? <ShieldCheck className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
      {labels[level]}
    </span>
  );
}
