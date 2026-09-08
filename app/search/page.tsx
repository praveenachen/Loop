"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/async-state";
import { MarketplaceListing, RideListing, StudyGroup } from "@/types";

type SearchTab = "All results" | "Marketplace" | "Rides" | "Study Groups";

function includesQuery(values: Array<string | number>, query: string) {
  return values.some((value) => String(value).toLowerCase().includes(query));
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const [activeTab, setActiveTab] = useState<SearchTab>("All results");
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);
  const [rides, setRides] = useState<RideListing[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadSearchData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
        const responses = await Promise.all([
          fetch("/api/marketplace/listings", { cache: "no-store" }),
          fetch("/api/rides", { cache: "no-store" }),
          fetch("/api/study-groups", { cache: "no-store" })
        ]);
        if (responses.some((response) => !response.ok)) throw new Error("Search data could not be loaded");
        const [listingData, rideData, groupData] = await Promise.all(responses.map((response) => response.json()));
        setMarketplace(listingData as MarketplaceListing[]);
        setRides(rideData as RideListing[]);
        setGroups(groupData as StudyGroup[]);
    } catch {
      setLoadError("Search results could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSearchData();
  }, [loadSearchData]);

  const results = useMemo(() => {
    if (!normalizedQuery) return { marketplace: [], rides: [], groups: [] };
    return {
      marketplace: marketplace.filter((item) => includesQuery([item.title, item.description, item.category, item.location, item.seller.name], normalizedQuery)),
      rides: rides.filter((ride) => includesQuery([ride.route, ride.departure, ride.car, ride.driver.name, ride.pricePerSeat], normalizedQuery)),
      groups: groups.filter((group) => includesQuery([group.course, group.title, group.focus, group.location, group.host.name], normalizedQuery))
    };
  }, [groups, marketplace, normalizedQuery, rides]);

  const total = results.marketplace.length + results.rides.length + results.groups.length;
  const showMarketplace = activeTab === "All results" || activeTab === "Marketplace";
  const showRides = activeTab === "All results" || activeTab === "Rides";
  const showGroups = activeTab === "All results" || activeTab === "Study Groups";
  const visibleTotal = (showMarketplace ? results.marketplace.length : 0) + (showRides ? results.rides.length : 0) + (showGroups ? results.groups.length : 0);

  return (
    <LoopPageFrame
      title="Search Loop"
      subtitle={query ? `Results for "${query}" across the verified student network.` : "Search marketplace listings, rides, and study groups from the header."}
      mascotSrc="/geese/goose-reader.png"
      mascotAlt="Goose searching Loop"
      tabs={["All results", "Marketplace", "Rides", "Study Groups"]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as SearchTab)}
      tone="neutral"
    >
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 text-sm font-extrabold text-ink-soft">
          <Search className="h-4 w-4 text-accent" />
          {loading ? "Searching..." : `${visibleTotal} result${visibleTotal === 1 ? "" : "s"} found`}
        </p>
        {loading ? <LoadingState label="Searching Loop..." rows={2} /> : null}
        {!loading && loadError ? <ErrorState message={loadError} onRetry={() => void loadSearchData()} retrying={loading} /> : null}
        {!loading && !loadError && query && visibleTotal === 0 ? <EmptyState title="No matching results" message="Try a broader route, course, item, location, or student name." /> : null}

        {!loading && !loadError && showMarketplace && results.marketplace.length > 0 ? (
          <section>
            <h2 className="mb-3 font-display text-2xl font-semibold text-ink">Marketplace</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {results.marketplace.map((item) => (
                <Link key={item.id} href="/marketplace" className="rounded-xl border border-marketplace/25 bg-white p-4 shadow-card hover:border-marketplace">
                  <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{item.category} - {item.location} - ${item.price}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {!loading && !loadError && showRides && results.rides.length > 0 ? (
          <section>
            <h2 className="mb-3 font-display text-2xl font-semibold text-ink">Rides</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {results.rides.map((ride) => (
                <Link key={ride.id} href="/rides" className="rounded-xl border border-rides/50 bg-white p-4 shadow-card hover:border-ink/30">
                  <p className="font-display text-lg font-semibold text-ink">{ride.route}</p>
                  <p className="mt-1 text-sm text-ink-soft">{ride.departure} - ${ride.pricePerSeat}/seat - {ride.driver.name}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {!loading && !loadError && showGroups && results.groups.length > 0 ? (
          <section>
            <h2 className="mb-3 font-display text-2xl font-semibold text-ink">Study Groups</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {results.groups.map((group) => (
                <Link key={group.id} href="/study-groups" className="rounded-xl border border-study/25 bg-white p-4 shadow-card hover:border-study">
                  <p className="font-display text-lg font-semibold text-ink">{group.course}: {group.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{group.schedule} - {group.location}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </LoopPageFrame>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm font-semibold text-ink-soft">Loading search...</p>}>
      <SearchResults />
    </Suspense>
  );
}
