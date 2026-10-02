import { router } from "expo-router";
import { LoopScreen, MobileHero, LoopButton } from "../components";
export default function NotFound() {
  return (
    <LoopScreen tab={false}>
      <MobileHero
        title="Let’s head back"
        subtitle="This page isn’t in your Loop yet."
        goose="backpack"
      />
      <LoopButton onPress={() => router.replace("/")}>Back to Home</LoopButton>
    </LoopScreen>
  );
}
