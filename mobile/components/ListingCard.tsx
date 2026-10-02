import { useAction } from "../lib/useAction";
import { FeedbackBanner } from "./AsyncState";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import type { MarketplaceListing } from "../lib/types";
import { useLoop } from "../lib/AppProvider";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { StatusBadge, WantedBadge } from "./StatusBadge";
import { isWanted, listingTitle } from "../lib/listing";
import { CardFooter, TrustRow } from "./CardParts";
import { CompactCard, CardTopSlot } from "./CompactCard";
import { PriceText } from "./PriceText";
export function ListingCard({
  listing,
  detail = false,
}: {
  listing: MarketplaceListing;
  detail?: boolean;
}) {
  const { contact } = useLoop();
  const action = useAction();
  const wanted = isWanted(listing);
  const title = listingTitle(listing);
  const heading = (
    <>
      <LoopText variant="cardHeading" numberOfLines={detail ? undefined : 2}>{title}</LoopText>
      <LoopText variant="smallBody" numberOfLines={1}>
        {listing.category} - {listing.location}
      </LoopText>
    </>
  );
  const contactButton = (
    <LoopButton
      compact={!detail}
      variant="marketplace"
      disabled={action.busy || listing.isOwner || listing.status === "sold"}
      onPress={() => { void action.run(async () => { const id = await contact(listing.id); router.push(`/messages/${id}`); }); }}
    >
      {listing.isOwner
        ? wanted
          ? "Your Request"
          : "Your Listing"
        : listing.contactedByCurrentUser
          ? detail
            ? "Open Conversation"
            : "Open Chat"
          : wanted
            ? "Message Buyer"
            : "Message Seller"}
    </LoopButton>
  );
  if (!detail)
    return (
      <CompactCard
        tone="marketplace"
        left={
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${wanted ? "request" : "listing"}: ${title}`}
              onPress={() => router.push(`/listings/${listing.id}`)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <LoopText variant="cardTitle" numberOfLines={1}>{title}</LoopText>
            </Pressable>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {wanted ? <WantedBadge /> : null}
              {listing.status !== "available" ? <StatusBadge status={listing.status} /> : null}
              <LoopText variant="meta" numberOfLines={1} style={{ flexShrink: 1 }}>
                {listing.category} · {listing.postedAt}
              </LoopText>
            </View>
            <LoopText variant="meta" numberOfLines={1}>
              {listing.location}
            </LoopText>
          </>
        }
        right={
          <>
            <CardTopSlot>
              <PriceText amount={listing.price} prefix={wanted ? "up to " : undefined} />
            </CardTopSlot>
            {contactButton}
          </>
        }
        below={
          <>
            {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
            {action.success ? <FeedbackBanner message={action.success} /> : null}
          </>
        }
      />
    );
  return (
    <LoopCard tone="marketplace">
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        {detail ? (
          <View style={{ flex: 1, minWidth: 120 }}>{heading}</View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${wanted ? "request" : "listing"}: ${title}`}
            onPress={() => router.push(`/listings/${listing.id}`)}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 120,
              minHeight: 44,
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            {heading}
          </Pressable>
        )}
        <View style={{ gap: 4, alignItems: "flex-end" }}>
          {wanted ? <WantedBadge /> : null}
          <StatusBadge status={listing.status} />
        </View>
      </View>
      <LoopText variant="smallBody" numberOfLines={detail ? undefined : 3}>{listing.description}</LoopText>
      <CardFooter>
        <TrustRow user={listing.seller} />
        <LoopText variant="chip">
          {wanted ? "Wanted by" : "Sold by"} {listing.seller.name} - Posted {listing.postedAt}
        </LoopText>
        <PriceText amount={listing.price} prefix={wanted ? "up to " : undefined} />
        <LoopButton
          variant="secondary"
          disabled={action.busy || listing.isOwner || listing.status === "sold"}
          onPress={() => { void action.run(async () => { const id = await contact(listing.id); router.push(`/messages/${id}`); }); }}
        >
          {listing.isOwner
            ? wanted
              ? "Your Request"
              : "Your Listing"
            : listing.contactedByCurrentUser
              ? "Open Conversation"
              : wanted
                ? "Message Buyer"
                : "Message Seller"}
        </LoopButton>
      </CardFooter>
      {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
      {action.success ? <FeedbackBanner message={action.success} /> : null}
    </LoopCard>
  );
}
