import { Quote } from "lucide-react";

import { RatingChip } from "@/components/ui/rating-chip";
import { Review } from "@/types";

interface ReviewSnippetProps {
  review: Review;
}

export function ReviewSnippet({ review }: ReviewSnippetProps) {
  return (
    <article className="rounded-2xl border border-stroke bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">{review.subject}</p>
          <p className="text-xs text-ink-soft">
            {review.author.name} • {review.createdAt}
          </p>
        </div>
        <RatingChip rating={review.rating} className="bg-surface-soft text-ink" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        <Quote className="mr-1 inline h-3.5 w-3.5 text-ink-soft" />
        {review.body}
      </p>
    </article>
  );
}
