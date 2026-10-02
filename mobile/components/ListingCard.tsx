import { useAction } from "../lib/useAction";
import { FeedbackBanner } from "./AsyncState";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import type { MarketplaceListing } from "../lib/types";
import { useLoop } from "../lib/AppProvider";
import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { LoopButton } from "./LoopButton";
import { StatusBadge } from "./StatusBadge";
import { CardFooter, TrustRow } from "./CardParts";
export function ListingCard({
  listing,
  detail = false,
}: {
  listing: MarketplaceListing;
  detail?: boolean;
}) {
  const { contact } = useLoop();
  const action = useAction();
  const heading = (
    <>
      <LoopText variant="cardHeading">{listing.title}</LoopText>
      <LoopText variant="smallBody">
        {listing.category} - {listing.location}
      </LoopText>
    </>
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
            accessibilityLabel={`Open listing: ${listing.title}`}
            onPress={() => router.push(`/listings/${listing.id}`)}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 120,
              minHeight: 44,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {heading}
          </Pressable>
        )}
        <StatusBadge status={listing.status} />
      </View>
      <LoopText variant="smallBody">{listing.description}</LoopText>
      <CardFooter>
        <TrustRow user={listing.seller} />
        <LoopText variant="chip">
          {listing.seller.name} - Posted {listing.postedAt}
        </LoopText>
        <LoopText variant="display">${listing.price}</LoopText>
        <LoopButton
          variant="secondary"
          disabled={action.busy || listing.isOwner || listing.status === "sold"}
          onPress={() => { void action.run(async () => { const id = await contact(listing.id); router.push(`/messages/${id}`); }); }}
        >
          {listing.isOwner
            ? "Your Listing"
            : listing.contactedByCurrentUser
              ? "Open Conversation"
              : "Message Seller"}
        </LoopButton>
      </CardFooter>
      {action.error ? <FeedbackBanner tone="error" message={action.error} /> : null}
      {action.success ? <FeedbackBanner message={action.success} /> : null}
    </LoopCard>
  );
}
