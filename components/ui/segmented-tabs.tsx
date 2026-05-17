import { cn } from "@/lib/utils";

interface SegmentedTabsProps {
  tabs: string[];
  active: string;
}

export function SegmentedTabs({ tabs, active }: SegmentedTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition",
            tab === active
              ? "border-ink/20 bg-ink text-white"
              : "border-stroke bg-white text-ink-soft hover:bg-surface-soft hover:text-ink"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
