import { Plus } from "lucide-react-native";
import { colors } from "../../theme";
import { useState } from "react";
import { router } from "expo-router";
import {
  LoopPageFrame,
  LoopText,
  LoopButton,
  RideCard,
  EmptyState,
  LoopLoadState,
  LoopPill,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
export default function RidesScreen() {
  const { data, loading, error } = useLoop();
  const [tab, setTab] = useState("Request a Ride");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const visible = data.rides.filter(
    (r) =>
      (tab !== "Request a Ride" || r.mode !== "request") &&
      (tab !== "Offer to Drive" || r.mode === "request") &&
      (tab !== "History" || r.isOwner || r.requestedByCurrentUser) &&
      (!query ||
        [r.route, r.departure, r.car, r.driver.name, `$${r.pricePerSeat}`].some(
          (value) => value.toLowerCase().includes(query),
        )),
  );
  return (
    <LoopPageFrame
      title="Rides"
      subtitle="Find trusted rides between Waterloo and nearby cities, or offer seats with clear student verification."
      goose="driver"
      tone="rides"
      tabs={["Request a Ride", "Offer to Drive", "History"]}
      activeTab={tab}
      onTabChange={setTab}
      searchValue={searchQuery}
      searchPlaceholder="Search routes, times, drivers, or vehicles"
      onSearchChange={setSearchQuery}
      actions={
        <>
          <LoopButton
            icon={<Plus size={16} color={colors.ink} />}
            variant="rides"
            onPress={() =>
              router.push({
                pathname: "/forms/ride",
                params: {
                  mode: tab === "Offer to Drive" ? "request" : "offer",
                },
              })
            }
          >
            {tab === "Offer to Drive" ? "Request a Trip" : "Offer a Trip"}
          </LoopButton>
          <LoopButton
            variant="secondary"
            onPress={() => router.push("/safety")}
          >
            Safety + Trust
          </LoopButton>
        </>
      }
    >
      <LoopPill
        label={
          tab === "Request a Ride"
            ? "Current ride options"
            : tab === "Offer to Drive"
              ? "Current ride requests"
              : "Your ride activity"
        }
      />
      <LoopText variant="smallBody">Weekend demand is high</LoopText>
      <LoopText variant="sectionHeading" accessibilityRole="header">
        {tab === "Request a Ride"
          ? "Open Ride Listings"
          : tab === "Offer to Drive"
            ? "Open Ride Requests"
            : "Your Ride History"}
      </LoopText>
      <LoopLoadState />
      {!loading && !error ? (
        visible.length ? (
          visible.map((r) => <RideCard key={r.id} ride={r} />)
        ) : (
          <EmptyState
            title="No matching rides"
            message="Try another filter or publish a trip."
          />
        )
      ) : null}
    </LoopPageFrame>
  );
}
