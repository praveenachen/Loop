"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Car, CalendarClock, Plus } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { RideCard } from "@/components/shared/ride-card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, FeedbackBanner, LoadingState } from "@/components/ui/async-state";
import { Dialog } from "@/components/ui/dialog";
import { RideListing } from "@/types";

export default function RidesPage() {
  const [mode, setMode] = useState<"Request a Ride" | "Offer to Drive" | "History">("Request a Ride");
  const [activeFilter, setActiveFilter] = useState("All rides");
  const [rideListings, setRideListings] = useState<RideListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [pendingRideId, setPendingRideId] = useState<string | null>(null);
  const [form, setForm] = useState({ route: "", departure: "", pricePerSeat: 0, seats: 1, car: "", mode: "OFFER" as "OFFER" | "REQUEST" });

  const loadRides = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/rides", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load rides");
      const data = (await res.json()) as RideListing[];
      setRideListings(data);
    } catch {
      setLoadError("Ride listings could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRides();
  }, [loadRides]);

  function openCreateDialog(createMode: "OFFER" | "REQUEST") {
    setForm((current) => ({ ...current, mode: createMode }));
    setFeedback(null);
    setDialogOpen(true);
  }

  async function createRide(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback({ message: payload.error ?? "Could not publish the ride.", tone: "error" });
        return;
      }

      await loadRides();
      setMode(form.mode === "OFFER" ? "Request a Ride" : "Offer to Drive");
      setForm({ route: "", departure: "", pricePerSeat: 0, seats: 1, car: "", mode: "OFFER" });
      setDialogOpen(false);
      setFeedback({ message: "Ride published successfully.", tone: "success" });
    } catch {
      setFeedback({ message: "Could not reach the server. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function requestSeat(ride: RideListing) {
    setPendingRideId(ride.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/rides/${ride.id}/request-seat`, { method: "POST" });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback({ message: payload.error ?? "Could not request this seat.", tone: "error" });
        return;
      }
      await loadRides();
      setFeedback({ message: `Seat requested for ${ride.route}.`, tone: "success" });
    } catch {
      setFeedback({ message: "Could not reach the server. Please try again.", tone: "error" });
    } finally {
      setPendingRideId(null);
    }
  }

  const filteredRides = useMemo(() => {
    return rideListings.filter((ride) => {
      if (mode === "Request a Ride" && ride.mode === "request") return false;
      if (mode === "Offer to Drive" && ride.mode !== "request") return false;
      if (mode === "History" && !ride.isOwner && !ride.requestedByCurrentUser) return false;
      if (activeFilter === "Seats open" && (ride.seats <= 0 || ride.seatStatus !== "seats-open")) return false;
      if (activeFilter === "Under $20" && ride.pricePerSeat >= 20) return false;
      if (activeFilter === "Top rated" && ride.driver.rating < 4.9) return false;
      return true;
    });
  }, [activeFilter, mode, rideListings]);

  return (
    <LoopPageFrame
      title="Rides"
      subtitle="Find trusted rides between Waterloo and nearby cities, or offer seats with clear student verification."
      mascotSrc="/geese/goose-driver.png"
      mascotAlt="Driver goose mascot"
      tabs={["Request a Ride", "Offer to Drive", "History"]}
      activeTab={mode}
      onTabChange={(tab) => setMode(tab as typeof mode)}
      filters={["All rides", "Seats open", "Under $20", "Top rated"]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      tone="rides"
      actions={
        <Button variant="rides" onClick={() => openCreateDialog(mode === "Offer to Drive" ? "REQUEST" : "OFFER")}>
            <Plus className="mr-2 h-4 w-4" />
            {mode === "Offer to Drive" ? "Request a Trip" : "Offer a Trip"}
        </Button>
      }
    >
      <div className="space-y-4">
        {feedback && !dialogOpen ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
        <div className="flex flex-wrap gap-2">
          <span className="loop-pill bg-rides/30 text-ink">
            <Car className="h-4 w-4" />
            {mode === "Request a Ride" ? "Current ride options" : mode === "Offer to Drive" ? "Current ride requests" : "Your ride activity"}
          </span>
          <span className="loop-pill">
            <CalendarClock className="h-4 w-4" />
            Weekend demand is high
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {mode === "Request a Ride" ? "Open Ride Listings" : mode === "Offer to Drive" ? "Open Ride Requests" : "Your Ride History"}
        </h2>
        {loading ? <LoadingState label="Loading rides..." rows={2} /> : null}
        {!loading && loadError ? <ErrorState message={loadError} onRetry={() => void loadRides()} retrying={loading} /> : null}
        {!loading && !loadError && filteredRides.length === 0 ? (
          <EmptyState title="No matching rides" message="Try another filter or publish a trip." />
        ) : null}
        {!loading && !loadError ? <div className="space-y-4">
          {filteredRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} actionPending={pendingRideId === ride.id} onRequestSeat={requestSeat} />
          ))}
        </div> : null}
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
          {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="rides" disabled={submitting}>{submitting ? "Publishing..." : form.mode === "OFFER" ? "Publish Offer" : "Publish Request"}</Button>
          </div>
        </form>
      </Dialog>
    </LoopPageFrame>
  );
}
