import { useLocalSearchParams, router } from "expo-router";
import {
  LoopScreen,
  MobileHero,
  StudyCard,
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
  const item = data.groups.find((i) => i.id === id);
  return (
    <LoopScreen tab={false}>
      <LoopLoadState />
      {!loading && !error ? item ? (
        <>
          <MobileHero
            title="Study-Pair"
            subtitle={item.title}
            goose="reader"
            tone="study"
          />
          {created === "1" ? (
            <FeedbackBanner message="Study group published successfully." />
          ) : null}
          <StudyCard group={item} detail />
        </>
      ) : (
        <>
          <EmptyState
            title="Study Group unavailable"
            message="This item is no longer available. Pull to refresh and try again."
          />
          <LoopButton onPress={() => router.replace("/study")}>
            Back to Study-Pair
          </LoopButton>
        </>
      ) : null}
    </LoopScreen>
  );
}
