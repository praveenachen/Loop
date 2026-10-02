import type { ReactNode } from "react";
import { LoopScreen } from "./LoopScreen";
import { MobileHero, type MobileHeroProps } from "./MobileHero";
import { LoopTabs } from "./LoopTabs";
import { LoopFilterRow } from "./LoopFilterRow";
import { LoopSearchBar } from "./LoopSearchBar";
import { View } from "react-native";
export function LoopPageFrame({
  children,
  tab = true,
  vivid = false,
  bare = false,
  tabs,
  activeTab,
  onTabChange,
  filters,
  activeFilter,
  onFilterChange,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  ...hero
}: MobileHeroProps & {
  children: ReactNode;
  tab?: boolean;
  vivid?: boolean;
  bare?: boolean;
  tabs?: readonly string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  filters?: readonly string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}) {
  return (
    <LoopScreen tab={tab} vivid={vivid} bare={bare} tone={hero.tone}>
      <MobileHero {...hero} />
      {tabs && activeTab !== undefined && onTabChange ? (
        <LoopTabs items={tabs} active={activeTab} onChange={onTabChange} />
      ) : null}
      {onSearchChange ? (
        <LoopSearchBar
          value={searchValue ?? ""}
          placeholder={searchPlaceholder ?? "Search"}
          onChange={onSearchChange}
        />
      ) : filters && activeFilter !== undefined && onFilterChange ? (
        <LoopFilterRow
          items={filters}
          active={activeFilter}
          onChange={onFilterChange}
        />
      ) : null}
      <View style={{ width: "100%", maxWidth: "100%", paddingHorizontal: 2, gap: 16 }}>
        {children}
      </View>
    </LoopScreen>
  );
}
