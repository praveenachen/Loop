import { useLocalSearchParams, router } from "expo-router";
import {
  LoopScreen,
  MobileHero,
  RideCard,
  EmptyState,
  LoopButton,
  FeedbackBanner,
  LoopLoadState,
} from "../../components";
import { useLoop } from "../../lib/AppProvider";
export default function Detail() {
  const { id, created } = useLocalSearchParams<{
    id: string;
    created?: string;
  }>();
  const { data, loading, error } = useLoop();
  const item = data.rides.find((i) => i.id === id);
  return (
    <LoopScreen tab={false}>
      <LoopLoadState />
      {!loading && !error ? item ? (
        <>
          <MobileHero
            title="Rides"
            subtitle={item.route}
            goose="driver"
            tone="rides"
          />
          {created === "1" ? (
            <FeedbackBanner message="Ride published successfully." />
          ) : null}
          <RideCard ride={item} detail />
        </>
      ) : (
        <>
          <EmptyState
            title="Ride unavailable"
            message="This item is no longer available. Pull to refresh and try again."
          />
          <LoopButton onPress={() => router.replace("/rides")}>
            Back to Rides
          </LoopButton>
        </>
      ) : null}
    </LoopScreen>
  );
}
