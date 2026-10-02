import type { ReactNode } from "react";
import { LoopScreen } from "./LoopScreen";
import { MobileHero, type MobileHeroProps } from "./MobileHero";
import { LoopTabs } from "./LoopTabs";
import { LoopFilterRow } from "./LoopFilterRow";
import { LoopCard } from "./LoopCard";
export function LoopPageFrame({
  children,
  tab = true,
  tabs,
  activeTab,
  onTabChange,
  filters,
  activeFilter,
  onFilterChange,
  ...hero
}: MobileHeroProps & {
  children: ReactNode;
  tab?: boolean;
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  filters?: readonly string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}) {
  return (
    <LoopScreen tab={tab}>
      <MobileHero {...hero} />
      <LoopTabs items={tabs} active={activeTab} onChange={onTabChange} />
      {filters && activeFilter !== undefined && onFilterChange ? (
        <LoopFilterRow
          items={filters}
          active={activeFilter}
          onChange={onFilterChange}
        />
      ) : null}
      <LoopCard panel style={{ padding: 16, gap: 20 }}>
        {children}
      </LoopCard>
    </LoopScreen>
  );
}
