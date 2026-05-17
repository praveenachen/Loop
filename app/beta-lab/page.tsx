"use client";

import { FormEvent, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const inputClass = "w-full rounded-xl border border-stroke px-3 py-2 text-sm";
const labelClass = "text-xs font-extrabold uppercase tracking-[0.08em] text-ink-soft";

const DEFAULT_MARKETPLACE = {
  title: "Example: iPad Air 5 (64GB) - Great condition",
  description: "Briefly describe condition, included accessories, and pickup preference.",
  price: 120,
  location: "Example: SLC, DC Library, or UWP",
  category: "Example: Electronics, Textbooks, Furniture, Requests"
};

const DEFAULT_RIDE = {
  route: "Example: Waterloo -> Union Station",
  departure: "Example: Thu, 5:30 PM",
  pricePerSeat: 15,
  seats: 3,
  car: "Example: Honda Civic 2020",
  mode: "OFFER"
};

const DEFAULT_STUDY = {
  course: "Example: CS 246",
  title: "Example: Midterm Review Session",
  schedule: "Example: Sun, 3:00 PM - 5:00 PM",
  location: "Example: DC Library, MC, E7",
  seatsLeft: 5,
  focus: "Briefly describe what topics the group will cover."
};

export default function BetaLabPage() {
  const [status, setStatus] = useState("");

  const [marketplace, setMarketplace] = useState(DEFAULT_MARKETPLACE);

  const [ride, setRide] = useState(DEFAULT_RIDE);

  const [study, setStudy] = useState(DEFAULT_STUDY);

  async function submitMarketplace(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/marketplace/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marketplace)
    });
    const payload = (await res.json()) as { id?: string; error?: string };
    if (res.ok) {
      setMarketplace({ ...DEFAULT_MARKETPLACE });
      setStatus(`Marketplace listing created (id: ${payload.id}).`);
      return;
    }
    setStatus(`Marketplace failed: ${payload.error ?? "unknown error"}`);
  }

  async function submitRide(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ride)
    });
    const payload = (await res.json()) as { id?: string; error?: string };
    if (res.ok) {
      setRide({ ...DEFAULT_RIDE });
      setStatus(`Ride listing created (id: ${payload.id}).`);
      return;
    }
    setStatus(`Ride failed: ${payload.error ?? "unknown error"}`);
  }

  async function submitStudy(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/study-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(study)
    });
    const payload = (await res.json()) as { id?: string; error?: string };
    if (res.ok) {
      setStudy({ ...DEFAULT_STUDY });
      setStatus(`Study group created (id: ${payload.id}).`);
      return;
    }
    setStatus(`Study group failed: ${payload.error ?? "unknown error"}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 rounded-2xl border border-stroke bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-semibold text-ink">Beta Lab</h1>
      <p className="text-sm text-ink-soft">Enter your own values below, then submit to create real records in the database.</p>

      <div className="grid gap-4">
        <details className="group rounded-2xl border border-marketplace/30 bg-marketplace/5 p-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-marketplace/15 px-3 py-2 font-display text-xl font-semibold text-marketplace [&::-webkit-details-marker]:hidden">
            <span>Marketplace Listing Form</span>
            <ChevronDown className="h-6 w-6 text-marketplace transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <p className="mt-1 text-sm text-ink-soft">Fill this out to create a buy/sell/request listing.</p>
          <form className="mt-3 space-y-2" onSubmit={submitMarketplace}>
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={marketplace.title} onChange={(e) => setMarketplace({ ...marketplace, title: e.target.value })} />
          <label className={labelClass}>Description</label>
          <textarea className={`${inputClass} min-h-20`} value={marketplace.description} onChange={(e) => setMarketplace({ ...marketplace, description: e.target.value })} />
          <label className={labelClass}>Price</label>
          <input className={inputClass} type="number" value={marketplace.price} onChange={(e) => setMarketplace({ ...marketplace, price: Number(e.target.value) })} />
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={marketplace.location} onChange={(e) => setMarketplace({ ...marketplace, location: e.target.value })} />
          <label className={labelClass}>Category</label>
          <input className={inputClass} value={marketplace.category} onChange={(e) => setMarketplace({ ...marketplace, category: e.target.value })} />
          <Button type="submit" variant="marketplace" className="w-full">
            Create Marketplace Listing
          </Button>
          </form>
        </details>

        <details className="group rounded-2xl border border-rides/40 bg-rides/15 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-rides/35 px-3 py-2 font-display text-xl font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <span>Ride Listing Form</span>
            <ChevronDown className="h-6 w-6 text-ink transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <p className="mt-1 text-sm text-ink-soft">Create a ride offer or ride request for beta testing.</p>
          <form className="mt-3 space-y-2" onSubmit={submitRide}>
          <label className={labelClass}>Route</label>
          <input className={inputClass} value={ride.route} onChange={(e) => setRide({ ...ride, route: e.target.value })} />
          <label className={labelClass}>Departure</label>
          <input className={inputClass} value={ride.departure} onChange={(e) => setRide({ ...ride, departure: e.target.value })} />
          <label className={labelClass}>Price Per Seat</label>
          <input className={inputClass} type="number" value={ride.pricePerSeat} onChange={(e) => setRide({ ...ride, pricePerSeat: Number(e.target.value) })} />
          <label className={labelClass}>Seats</label>
          <input className={inputClass} type="number" value={ride.seats} onChange={(e) => setRide({ ...ride, seats: Number(e.target.value) })} />
          <label className={labelClass}>Car</label>
          <input className={inputClass} value={ride.car} onChange={(e) => setRide({ ...ride, car: e.target.value })} />
          <label className={labelClass}>Mode</label>
          <select className={inputClass} value={ride.mode} onChange={(e) => setRide({ ...ride, mode: e.target.value })}>
            <option value="OFFER">Offer</option>
            <option value="REQUEST">Request</option>
          </select>
          <Button type="submit" variant="rides" className="w-full">
            Create Ride Listing
          </Button>
          </form>
        </details>

        <details className="group rounded-2xl border border-study/35 bg-study/10 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-study/20 px-3 py-2 font-display text-xl font-semibold text-study [&::-webkit-details-marker]:hidden">
            <span>Study Group Form</span>
            <ChevronDown className="h-6 w-6 text-study transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <p className="mt-1 text-sm text-ink-soft">Use this to create a course-focused study group listing.</p>
          <form className="mt-3 space-y-2" onSubmit={submitStudy}>
          <label className={labelClass}>Course</label>
          <input className={inputClass} value={study.course} onChange={(e) => setStudy({ ...study, course: e.target.value })} />
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={study.title} onChange={(e) => setStudy({ ...study, title: e.target.value })} />
          <label className={labelClass}>Schedule</label>
          <input className={inputClass} value={study.schedule} onChange={(e) => setStudy({ ...study, schedule: e.target.value })} />
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={study.location} onChange={(e) => setStudy({ ...study, location: e.target.value })} />
          <label className={labelClass}>Seats Left</label>
          <input className={inputClass} type="number" value={study.seatsLeft} onChange={(e) => setStudy({ ...study, seatsLeft: Number(e.target.value) })} />
          <label className={labelClass}>Focus</label>
          <textarea className={`${inputClass} min-h-20`} value={study.focus} onChange={(e) => setStudy({ ...study, focus: e.target.value })} />
          <Button type="submit" variant="study" className="w-full">
            Create Study Group
          </Button>
          </form>
        </details>
      </div>

      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </div>
  );
}
