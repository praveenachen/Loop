import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopButton,
  RideCard,
  EmptyState,
  LoopLoadState,
  SectionHeader,
  SectionDropdown,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
const TABS = ["See All", "Your Rides", "Your History"] as const;
export default function RidesScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("See All");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.rides.filter(
    (r) =>
      (tab !== "Your Rides" || r.isOwner) &&
      (tab !== "Your History" || r.requestedByCurrentUser) &&
      (!query ||
        [r.route, r.departure, r.car, r.driver.name, `$${r.pricePerSeat}`].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Rides"
      subtitle="Find a verified driver or share your route with students."
      goose="driver"
      tone="rides"
      searchValue={searchQuery}
      searchPlaceholder="Search routes, times, drivers, or vehicles"
      onSearchChange={setSearchQuery}
      actions={
          <LoopButton
            icon={<Plus size={16} color={colors.ink} />}
            variant="rides"
            onPress={() =>
              router.push({
                pathname: "/forms/ride",
                params: { mode: "offer" },
              })
            }
          >
            Offer a Trip
          </LoopButton>
      }
    >
      <SectionHeader
        title={tab === "See All" ? "Open Ride Listings" : tab === "Your History" ? "Your Ride History" : tab}
        subtitle={`${visible.length} result${visible.length === 1 ? "" : "s"}`}
        action={<SectionDropdown options={TABS} value={tab} onChange={setTab} />}
      />
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          <View style={{ gap: 8 }}>
            {visible.map((r) => <RideCard key={r.id} ride={r} />)}
          </View>
        ) : (
          <EmptyState
            title="No matching rides"
            message="Try another search or publish a trip."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
