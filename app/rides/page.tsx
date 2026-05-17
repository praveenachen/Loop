"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, CalendarClock, Plus, Shield } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { RideCard } from "@/components/shared/ride-card";
import { Button } from "@/components/ui/button";
import { RideListing } from "@/types";

export default function RidesPage() {
  const [mode, setMode] = useState<"Request a Ride" | "Offer to Drive">("Request a Ride");
  const [rideListings, setRideListings] = useState<RideListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/rides", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load rides");
        const data = (await res.json()) as RideListing[];
        setRideListings(data);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredRides = useMemo(() => {
    return rideListings.filter((ride) => (mode === "Request a Ride" ? ride.mode !== "request" : ride.mode === "request"));
  }, [mode, rideListings]);

  return (
    <LoopPageFrame
      title="Rides"
      subtitle="Find trusted rides between Waterloo and nearby cities, or offer seats with clear student verification."
      mascotSrc="/geese/goose-driver.png"
      mascotAlt="Driver goose mascot"
      tabs={["Request a Ride", "Offer to Drive", "History"]}
      activeTab={mode}
      filters={["Start", "End", "Date", "Budget", "Women-only", "Top rated drivers"]}
      tone="rides"
      actions={
        <>
          <Button variant="secondary">
            <Shield className="mr-2 h-4 w-4" />
            Safety Rules
          </Button>
          <Button variant="rides" onClick={() => setMode(mode === "Request a Ride" ? "Offer to Drive" : "Request a Ride")}>
            <Plus className="mr-2 h-4 w-4" />
            {mode === "Request a Ride" ? "Offer a Trip" : "Request a Trip"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="loop-pill bg-rides/30 text-ink">
            <Car className="h-4 w-4" />
            {mode === "Request a Ride" ? "Current ride options" : "Current ride requests"}
          </span>
          <span className="loop-pill">
            <CalendarClock className="h-4 w-4" />
            Weekend demand is high
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {mode === "Request a Ride" ? "Open Ride Listings" : "Open Drive Offers"}
        </h2>
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading rides...</p> : null}
        {!loading && filteredRides.length === 0 ? (
          <p className="text-sm font-semibold text-ink-soft">No rides in this tab yet. Use Beta Lab to create one.</p>
        ) : null}
        <div className="space-y-4">
          {filteredRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button className="text-sm font-extrabold text-ink-soft hover:text-ink">See more rides...</button>
          <Button variant="secondary">{mode === "Request a Ride" ? "Can't find a ride? Request one!" : "Want to add a trip?"}</Button>
        </div>
      </div>
    </LoopPageFrame>
  );
}
