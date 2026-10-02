import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopButton,
  ListingCard,
  EmptyState,
  LoopLoadState,
  SectionHeader,
  SectionDropdown,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
import { isWanted } from "../../lib/listing";
const TABS = ["See All", "Your Listings", "Your Requests", "Your Purchases"] as const;
export default function MarketplaceScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("See All");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.listings.filter(
    (l) =>
      (tab !== "Your Listings" || (l.isOwner && !isWanted(l))) &&
      (tab !== "Your Requests" || (l.isOwner && isWanted(l))) &&
      (tab !== "Your Purchases" || (l.contactedByCurrentUser && !isWanted(l))) &&
      (!query ||
        [l.title, l.description, l.category, l.location, l.seller.name].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Marketplace"
      subtitle="Buy, sell, and coordinate with verified Waterloo students."
      goose="trophy"
      tone="marketplace"
      searchValue={searchQuery}
      searchPlaceholder="Search items for sale or wanted posts"
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
      <SectionHeader
        title={tab === "See All" ? "Latest Listings" : tab}
        subtitle={`${visible.length} ${tab === "Your Listings" || tab === "Your Requests" ? "posted" : tab === "Your Purchases" ? "requested" : "active"}`}
        action={<SectionDropdown options={TABS} value={tab} onChange={setTab} />}
      />
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          <View style={{ gap: 8 }}>
            {visible.map((l) => <ListingCard key={l.id} listing={l} />)}
          </View>
        ) : (
          <EmptyState
            title="No matching listings"
            message="Try another search or publish a new listing."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
