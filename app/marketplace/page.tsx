 "use client";

import { useEffect, useState } from "react";
import { Filter, Plus, Search, Tag } from "lucide-react";

import { LoopPageFrame } from "@/components/shared/loop-page-frame";
import { ListingCard } from "@/components/shared/listing-card";
import { Button } from "@/components/ui/button";
import { RatingChip } from "@/components/ui/rating-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { MarketplaceListing } from "@/types";

export default function MarketplacePage() {
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/marketplace/listings", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load marketplace listings");
        const data = (await res.json()) as MarketplaceListing[];
        setMarketplaceListings(data);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <LoopPageFrame
      title="Marketplace"
      subtitle="Browse campus listings with clear verification, price transparency, and quick in-app coordination."
      mascotSrc="/geese/goose-trophy.png"
      mascotAlt="Marketplace goose mascot"
      tabs={["Browse", "Sell", "Requests"]}
      activeTab="Browse"
      filters={["All categories", "Textbooks", "Furniture", "Electronics", "Requests", "Near me"]}
      tone="marketplace"
      actions={
        <>
          <Button variant="secondary">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="marketplace">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="loop-pill bg-marketplace/10 text-marketplace">
            <Tag className="h-4 w-4" />
            248 active listings
          </span>
          <span className="loop-pill">
            <Search className="h-4 w-4" />
            Smart sorting by trust + relevance
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">Latest Campus Listings</h2>
        {loading ? <p className="text-sm font-semibold text-ink-soft">Loading listings...</p> : null}
        {!loading && marketplaceListings.length === 0 ? (
          <p className="text-sm font-semibold text-ink-soft">No listings yet. Use Beta Lab to create one.</p>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-2">
          {marketplaceListings.map((item) => (
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
                    <Button variant="secondary" size="sm">
                      Message Seller
                    </Button>
                  </div>
                </>
              }
            />
          ))}
        </div>
      </div>
    </LoopPageFrame>
  );
}
