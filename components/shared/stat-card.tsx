import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "marketplace" | "rides" | "study";
}

const toneStyles = {
  default: "border-stroke bg-white",
  marketplace: "border-marketplace/25 bg-marketplace/5",
  rides: "border-rides/40 bg-rides/10",
  study: "border-study/25 bg-study/5"
};

export function StatCard({ label, value, hint, icon, tone = "default" }: StatCardProps) {
  return (
    <article className={cn("rounded-2xl border p-5 shadow-card", toneStyles[tone])}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">{label}</p>
        {icon}
      </div>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-ink-soft">{hint}</p> : null}
    </article>
  );
}
