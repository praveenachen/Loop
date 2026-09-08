 "use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { ListingCard } from "@/components/shared/listing-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { RatingChip } from "@/components/ui/rating-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { MarketplaceListing } from "@/types";

export default function MarketplacePage() {
  const router = useRouter();
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Browse");
  const [activeFilter, setActiveFilter] = useState("All categories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pendingListingId, setPendingListingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: 0, location: "", category: "" });

  const loadListings = useCallback(async () => {
    const res = await fetch("/api/marketplace/listings", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load marketplace listings");
    const data = (await res.json()) as MarketplaceListing[];
    setMarketplaceListings(data);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await loadListings();
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [loadListings]);

  const filteredListings = useMemo(() => {
    return marketplaceListings.filter((item) => {
      if (activeTab === "Sell" && !item.isOwner) return false;
      if (activeTab === "Requests" && item.category.toLowerCase() !== "requests") return false;
      if (activeFilter !== "All categories" && item.category.toLowerCase() !== activeFilter.toLowerCase()) return false;
      return true;
    });
  }, [activeFilter, activeTab, marketplaceListings]);

  async function createListing(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not create the listing.");
        return;
      }

      await loadListings();
      setForm({ title: "", description: "", price: 0, location: "", category: "" });
      setDialogOpen(false);
      setFeedback("Listing published successfully.");
    } catch {
      setFeedback("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function contactSeller(listing: MarketplaceListing) {
    setPendingListingId(listing.id);
    setFeedback("");
    try {
      const res = await fetch(`/api/marketplace/listings/${listing.id}/contact`, { method: "POST" });
      const payload = (await res.json()) as { conversationId?: string; error?: string };
      if (!res.ok) {
        setFeedback(payload.error ?? "Could not start the conversation.");
        return;
      }
      if (!payload.conversationId) {
        setFeedback("The conversation was created but could not be opened.");
        return;
      }
      router.push(`/messages?conversation=${encodeURIComponent(payload.conversationId)}`);
    } catch {
      setFeedback("Could not reach the server. Please try again.");
    } finally {
      setPendingListingId(null);
    }
  }

  return (
    <LoopPageFrame
      title="Marketplace"
      subtitle="Browse campus listings with clear verification, price transparency, and quick in-app coordination."
      mascotSrc="/geese/goose-trophy.png"
      mascotAlt="Marketplace goose mascot"
      tabs={["Browse", "Sell", "Requests"]}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === "Requests") setActiveFilter("All categories");
      }}
      filters={["All categories", "Textbooks", "Furniture", "Electronics", "Requests"]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      tone="marketplace"
      actions={
        <Button variant="marketplace" onClick={() => { setFeedback(""); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
        </Button>
      }
    >
      <div className="space-y-4">
        {feedback && !dialogOpen ? <p className="rounded-xl bg-marketplace/10 px-4 py-3 text-sm font-semibold text-marketplace">{feedback}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <span className="loop-pill bg-marketplace/10 text-marketplace">
            <Tag className="h-4 w-4" />
            {filteredListings.length} {activeTab === "Sell" ? "your" : "active"} listings
          </span>
          <span className="loop-pill">
            <Search className="h-4 w-4" />
            Smart sorting by trust + relevance
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">Latest Campus Listings</h2>
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading listings...</p> : null}
        {!loading && filteredListings.length === 0 ? (
          <p className="text-sm font-semibold text-ink-soft">No listings match this view.</p>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredListings.map((item) => (
            <ListingCard
              key={item.id}
              accent="marketplace"
              title={item.title}
              subtitle={`${item.category} - ${item.location}`}
              description={item.description}
              meta={<StatusBadge status={item.status} />}
              footer={
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RatingChip rating={item.seller.rating} reviews={item.seller.reviews} />
                      <VerificationBadge level={item.seller.verification} />
                    </div>
                    <p className="text-xs font-semibold text-ink-soft">
                      {item.seller.name} - Posted {item.postedAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-semibold text-ink">${item.price}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={item.isOwner || pendingListingId === item.id}
                      onClick={() => contactSeller(item)}
                    >
                      {item.isOwner ? "Your Listing" : pendingListingId === item.id ? "Opening..." : item.contactedByCurrentUser ? "Open Conversation" : "Message Seller"}
                    </Button>
                  </div>
                </>
              }
            />
          ))}
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        title="Create Marketplace Listing"
        description="Publish an item or request to the verified student marketplace."
        onClose={() => setDialogOpen(false)}
      >
        <form className="space-y-3" onSubmit={createListing}>
          <label className="block text-sm font-semibold text-ink">Title
            <input required minLength={3} maxLength={140} className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold text-ink">Description
            <textarea required minLength={8} maxLength={1000} className="mt-1 min-h-24 w-full rounded-xl border border-stroke px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">Price
              <input required min={0} step={1} type="number" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </label>
            <label className="block text-sm font-semibold text-ink">Category
              <input required minLength={2} maxLength={60} placeholder="Electronics" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">Pickup location
            <input required minLength={2} maxLength={120} placeholder="SLC" className="mt-1 w-full rounded-xl border border-stroke px-3 py-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          {feedback ? <p className="text-sm font-semibold text-study">{feedback}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="marketplace" disabled={submitting}>{submitting ? "Publishing..." : "Publish Listing"}</Button>
          </div>
        </form>
      </Dialog>
    </LoopPageFrame>
  );
}
