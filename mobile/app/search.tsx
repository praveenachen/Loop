import { useState, useEffect } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopCard,
  EmptyState,
  LoopLoadState,
} from "../components";
import { LoopSearchBar } from "../components/LoopSearchBar";
import { PressableScale } from "../components/PressableScale";
import { useLoop } from "../lib/AppProvider";
import { request } from "../lib/api";
import type { MarketplaceListing, RideListing, StudyGroup } from "../lib/types";
import { isWanted, listingTitle } from "../lib/listing";
import { LoadingState, ErrorState } from "../components";
export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [tab, setTab] = useState("All results");
  const { loading, error } = useLoop();
  const [results, setResults] = useState<{ listings: MarketplaceListing[]; rides: RideListing[]; groups: StudyGroup[] }>({ listings: [], rides: [], groups: [] });
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setSearchError(""); setSearching(!!query.trim());
    setResults({ listings: [], rides: [], groups: [] });
    const timer = setTimeout(() => {
      if (!query.trim()) { setSearching(false); return; }
      void request<typeof results>(`/api/search?q=${encodeURIComponent(query)}`).then(value => { if (active) setResults(value); }).catch(e => { if (active) setSearchError(e.message); }).finally(() => { if (active) setSearching(false); });
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [query, retry]);
  const sections = [
    {
      name: "Marketplace",
      tone: "marketplace" as const,
      items: results.listings.map((l) => ({
        id: l.id,
        title: listingTitle(l),
        subtitle: isWanted(l)
          ? `Wanted - ${l.location} - up to $${l.price}`
          : `For sale - ${l.category} - ${l.location} - $${l.price}`,
        href: `/listings/${l.id}`,
      })),
    },
    {
      name: "Rides",
      tone: "rides" as const,
      items: results.rides.map((r) => ({
        id: r.id,
        title: r.route,
        subtitle: `${r.departure} - $${r.pricePerSeat}/seat - ${r.driver.name}`,
        href: `/ride/${r.id}`,
      })),
    },
    {
      name: "Study Groups",
      tone: "study" as const,
      items: results.groups.map((g) => ({
        id: g.id,
        title: `${g.course}: ${g.title}`,
        subtitle: `${g.schedule} - ${g.location}`,
        href: `/groups/${g.id}`,
      })),
    },
  ].filter((s) => tab === "All results" || s.name === tab);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  return (
    <LoopPageFrame
      tab={false}
      title="Search Loop"
      subtitle="Search listings, rides, and study groups."
      goose="reader"
      tabs={["All results", "Marketplace", "Rides", "Study Groups"]}
      activeTab={tab}
      onTabChange={setTab}
    >
      <LoopSearchBar
        placeholder="Search listings, rides, study groups..."
        value={query}
        onChange={setQuery}
      />
      {query.trim() ? (
        <LoopText variant="chip">
          {loading || searching
            ? "Searching..."
            : `${total} result${total === 1 ? "" : "s"}`}
        </LoopText>
      ) : null}
      <LoopLoadState />
      {searching ? <LoadingState label="Searching Loop…" /> : searchError ? <ErrorState message={searchError} onRetry={() => setRetry(v => v + 1)} /> : null}
      {!loading && !error && !searching && !searchError ? (
        <>
          {query.trim() && total === 0 ? (
            <EmptyState
              title="No matching results"
              message="Try a broader route, course, item, location, or student name."
            />
          ) : null}
          {sections
            .filter((s) => s.items.length)
            .map((s) => (
              <View key={s.name} style={{ gap: 12 }}>
                <LoopText variant="sectionHeading">{s.name}</LoopText>
                {s.items.map((i) => (
                  <PressableScale
                    key={i.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Open result: ${i.title}`}
                    onPress={() => router.push(i.href)}
                  >
                    <LoopCard
                      tone={s.tone}
                      style={{ padding: 16, borderRadius: 12 }}
                    >
                      <LoopText variant="cardHeading">{i.title}</LoopText>
                      <LoopText variant="smallBody">{i.subtitle}</LoopText>
                    </LoopCard>
                  </PressableScale>
                ))}
              </View>
            ))}
        </>
      ) : null}
    </LoopPageFrame>
  );
}
