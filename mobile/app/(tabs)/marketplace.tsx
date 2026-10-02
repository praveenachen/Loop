import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopButton,
  ListingCard,
  EmptyState,
  LoopLoadState,
  LoopPill,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
export default function MarketplaceScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("Browse");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.listings.filter(
    (l) =>
      (tab !== "Sell" || l.isOwner) &&
      (tab !== "Requests" || l.category.toLowerCase() === "requests") &&
      (!query ||
        [l.title, l.description, l.category, l.location, l.seller.name].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Marketplace"
      subtitle="Browse campus listings with clear verification, price transparency, and quick in-app coordination."
      goose="trophy"
      tone="marketplace"
      tabs={["Browse", "Sell", "Requests"]}
      activeTab={tab}
      onTabChange={(t) => {
        setTab(t);
      }}
      searchValue={searchQuery}
      searchPlaceholder="Search listings, categories, or sellers"
      onSearchChange={setSearchQuery}
      actions={
        <LoopButton
          icon={<Plus size={16} color={colors.white} />}
          variant="marketplace"
          onPress={() => router.push("/forms/listing")}
        >
          Create Listing
        </LoopButton>
      }
    >
      <LoopPill
        label={`${visible.length} ${tab === "Sell" ? "your" : "active"} listings`}
      />
      <LoopText variant="smallBody">
        Smart sorting by trust + relevance
      </LoopText>
      <LoopText variant="sectionHeading" accessibilityRole="header">
        Latest Campus Listings
      </LoopText>
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          visible.map((l) => <ListingCard key={l.id} listing={l} />)
        ) : (
          <EmptyState
            title="No matching listings"
            message="Try another category or publish a new listing."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
