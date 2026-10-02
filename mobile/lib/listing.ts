import type { MarketplaceListing } from "./types";
// A "wanted" post is someone asking for an item (category "Requests"); everything else is an item for sale.
export const isWanted = (l: Pick<MarketplaceListing, "category">) =>
  l.category.trim().toLowerCase() === "requests";
// Seed/legacy titles carry a "Request: " prefix; the Wanted badge replaces it.
export const listingTitle = (l: Pick<MarketplaceListing, "title">) =>
  l.title.replace(/^request:\s*/i, "");
