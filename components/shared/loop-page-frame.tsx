import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { GooseImage } from "@/components/brand/goose-image";
import { cn } from "@/lib/utils";

interface LoopPageFrameProps {
  title: string;
  subtitle: string;
  mascotSrc: string;
  mascotAlt: string;
  tabs: string[];
  activeTab: string;
  filters?: string[];
  actions?: ReactNode;
  children: ReactNode;
  tone?: "marketplace" | "rides" | "study" | "neutral";
}

const toneClasses = {
  marketplace: "from-marketplace/15 to-white",
  rides: "from-rides/35 to-white",
  study: "from-study/15 to-white",
  neutral: "from-accent/10 to-white"
};

export function LoopPageFrame({
  title,
  subtitle,
  mascotSrc,
  mascotAlt,
  tabs,
  activeTab,
  filters,
  actions,
  children,
  tone = "neutral"
}: LoopPageFrameProps) {
  return (
    <div className="space-y-5">
      <section className={cn("loop-panel bg-gradient-to-br p-6 lg:p-7", toneClasses[tone])}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-stroke bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-ink-soft">
              <Sparkles className="h-3.5 w-3.5" />
              Student-first
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
            <p className="mt-2 text-base leading-relaxed text-ink-soft md:text-lg">{subtitle}</p>
          </div>
          <GooseImage
            src={mascotSrc}
            alt={mascotAlt}
            className="mt-2 h-44 w-44 self-end md:mt-4 md:h-56 md:w-56 lg:h-60 lg:w-60"
            fallbackClassName="mt-2 h-44 w-44 self-end md:mt-4 md:h-56 md:w-56 lg:h-60 lg:w-60"
          />
        </div>
        {actions ? <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div> : null}
      </section>

      <section className="loop-panel p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-extrabold transition md:text-base",
                tab === activeTab ? "bg-ink text-white" : "bg-surface-soft text-ink-soft hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {filters?.length ? (
        <section className="loop-panel p-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button key={filter} className="loop-pill bg-surface-soft">
                {filter}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="loop-panel p-5 lg:p-6">{children}</section>
    </div>
  );
}
