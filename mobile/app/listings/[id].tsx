import { useLocalSearchParams, router } from "expo-router";
import {
  LoopScreen,
  MobileHero,
  ListingCard,
  EmptyState,
  LoopButton,
  FeedbackBanner,
  LoopLoadState,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
import { isWanted, listingTitle } from "../../lib/listing";
export default function Detail() {
  const { id, created } = useLocalSearchParams<{
    id: string;
    created?: string;
  }>();
  const { data, loading, error } = useLoop();
  const item = data.listings.find((i) => i.id === id);
  return (
    <LoopScreen tab={false}>
      <LoopLoadState />
      {!loading && !error ? item ? (
        <>
          <MobileHero
            title={isWanted(item) ? "Wanted" : "For Sale"}
            subtitle={listingTitle(item)}
            goose="trophy"
            tone="marketplace"
          />
          {created === "1" ? (
            <FeedbackBanner message="Listing published successfully." />
          ) : null}
          <ListingCard listing={item} detail />
        </>
      ) : (
        <>
          <EmptyState
            title="Listing unavailable"
            message="This item is no longer available. Pull to refresh and try again."
          />
          <LoopButton onPress={() => router.replace("/marketplace")}>
            Back to Marketplace
          </LoopButton>
        </>
      ) : null}
    </LoopScreen>
  );
}
