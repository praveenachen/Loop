import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingChipProps {
  rating: number;
  reviews?: number;
  className?: string;
}

export function RatingChip({ rating, reviews, className }: RatingChipProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white", className)}>
      <Star className="h-3.5 w-3.5 fill-current" />
      <span>{rating.toFixed(1)}</span>
      {typeof reviews === "number" ? <span className="text-white/80">({reviews})</span> : null}
    </div>
  );
}
