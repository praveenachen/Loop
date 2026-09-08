"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Car, CalendarClock, Plus, Shield } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { RideCard } from "@/components/shared/ride-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { RideListing } from "@/types";

export default function RidesPage() {
  const [mode, setMode] = useState<"Request a Ride" | "Offer to Drive">("Request a Ride");
  const [rideListings, setRideListings] = useState<RideListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pendingRideId, setPendingRideId] = useState<string | null>(null);
  const [form, setForm] = useState({ route: "", departure: "", pricePerSeat: 0, seats: 1, car: "", mode: "OFFER" as "OFFER" | "REQUEST" });

  const loadRides = useCallback(async () => {
    const res = await fetch("/api/rides", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load rides");
    const data = (await res.json()) as RideListing[];
    setRideListings(data);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await loadRides();
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [loadRides]);

  function openCreateDialog(createMode: "OFFER" | "REQUEST") {
    setForm((current) => ({ ...current, mode: createMode }));
    setFeedback("");
    setDialogOpen(true);
  }

  async function createRide(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not publish the ride.");
        return;
      }

      await loadRides();
      setMode(form.mode === "OFFER" ? "Request a Ride" : "Offer to Drive");
      setForm({ route: "", departure: "", pricePerSeat: 0, seats: 1, car: "", mode: "OFFER" });
      setDialogOpen(false);
      setFeedback("Ride published successfully.");
    } catch {
      setFeedback("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestSeat(ride: RideListing) {
    setPendingRideId(ride.id);
    setFeedback("");
    try {
      const res = await fetch(`/api/rides/${ride.id}/request-seat`, { method: "POST" });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not request this seat.");
        return;
      }
      await loadRides();
      setFeedback(`Seat requested for ${ride.route}.`);
    } catch {
      setFeedback("Could not reach the server. Please try again.");
    } finally {
      setPendingRideId(null);
    }
  }

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
          <Button variant="rides" onClick={() => openCreateDialog(mode === "Request a Ride" ? "OFFER" : "REQUEST")}>
            <Plus className="mr-2 h-4 w-4" />
            {mode === "Request a Ride" ? "Offer a Trip" : "Request a Trip"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {feedback && !dialogOpen ? <p className="rounded-xl bg-rides/20 px-4 py-3 text-sm font-semibold text-ink">{feedback}</p> : null}
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
            <RideCard key={ride.id} ride={ride} actionPending={pendingRideId === ride.id} onRequestSeat={requestSeat} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button className="text-sm font-extrabold text-ink-soft hover:text-ink">See more rides...</button>
          <Button variant="secondary">{mode === "Request a Ride" ? "Can't find a ride? Request one!" : "Want to add a trip?"}</Button>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        title={form.mode === "OFFER" ? "Offer a Trip" : "Request a Trip"}
        description={form.mode === "OFFER" ? "Share your route and available seats with verified students." : "Post the route and time you need a ride."}
        onClose={() => setDialogOpen(false)}
      >
        <form className="space-y-3" onSubmit={createRide}>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-soft p-1">
            <button type="button" className={`rounded-lg px-3 py-2 text-sm font-extrabold ${form.mode === "OFFER" ? "bg-ink text-white" : "text-ink-soft"}`} onClick={() => setForm({ ...form, mode: "OFFER" })}>Offer a ride</button>
            <button type="button" className={`rounded-lg px-3 py-2 text-sm font-extrabold ${form.mode === "REQUEST" ? "bg-ink text-white" : "text-ink-soft"}`} onClick={() => setForm({ ...form, mode: "REQUEST" })}>Request a ride</button>
          </div>
          <label className="block text-sm font-semibold text-ink">Route
            <input required minLength={3} maxLength={140} placeholder="Waterloo to Toronto" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold text-ink">Departure
            <input required minLength={3} maxLength={80} placeholder="Friday at 5:30 PM" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.departure} onChange={(e) => setForm({ ...form, departure: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">Price per seat
              <input required min={0} step={1} type="number" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.pricePerSeat} onChange={(e) => setForm({ ...form, pricePerSeat: Number(e.target.value) })} />
            </label>
            <label className="block text-sm font-semibold text-ink">{form.mode === "OFFER" ? "Seats available" : "Seats needed"}
              <input required min={0} max={8} step={1} type="number" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">{form.mode === "OFFER" ? "Vehicle" : "Ride preference"}
            <input required minLength={2} maxLength={120} placeholder={form.mode === "OFFER" ? "Honda Civic 2020" : "Any verified driver"} className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.car} onChange={(e) => setForm({ ...form, car: e.target.value })} />
          </label>
          {feedback ? <p className="text-sm font-semibold text-study">{feedback}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="rides" disabled={submitting}>{submitting ? "Publishing..." : form.mode === "OFFER" ? "Publish Offer" : "Publish Request"}</Button>
          </div>
        </form>
      </Dialog>
    </LoopPageFrame>
  );
}
