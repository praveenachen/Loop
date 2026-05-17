import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  tone: "marketplace" | "rides" | "study";
  cta: string;
}

const tones = {
  marketplace: "from-marketplace/15 to-marketplace/5 border-marketplace/20",
  rides: "from-rides/30 to-rides/10 border-rides/40",
  study: "from-study/15 to-study/5 border-study/20"
};

export function ActionCard({ title, description, icon, tone, cta }: ActionCardProps) {
  return (
    <article
      className={cn(
        "group rounded-2xl border bg-gradient-to-br p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift",
        tones[tone]
      )}
    >
      <div className="mb-4 inline-flex rounded-xl bg-white/70 p-2 text-ink">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}
