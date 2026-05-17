import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ListingCardProps {
  title: string;
  subtitle: string;
  description: string;
  meta?: ReactNode;
  footer?: ReactNode;
  accent?: "default" | "marketplace" | "rides" | "study";
}

const accents = {
  default: "border-stroke",
  marketplace: "border-marketplace/20",
  rides: "border-rides/40",
  study: "border-study/20"
};

export function ListingCard({ title, subtitle, description, meta, footer, accent = "default" }: ListingCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        accents[accent]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <p className="text-sm text-ink-soft">{subtitle}</p>
        </div>
        {meta}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{description}</p>
      {footer ? <div className="mt-4 flex items-center justify-between gap-2 border-t border-stroke pt-4">{footer}</div> : null}
    </article>
  );
}
