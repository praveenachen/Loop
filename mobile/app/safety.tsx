import { LoopScreen, MobileHero, LoopCard, LoopText } from "../components";
export default function SafetyScreen() {
  return (
    <LoopScreen tab={false}>
      <MobileHero
        title="Safety + Trust"
        subtitle="Keep your campus connections comfortable and clear."
        goose="backpack"
      />
      <LoopCard panel>
        <LoopText variant="sectionHeading">Plan together</LoopText>
        <LoopText>
          Confirm pickup locations, departure times, and seat details in-app
          before travelling.
        </LoopText>
        <LoopText variant="sectionHeading">Trust stays visible</LoopText>
        <LoopText>
          Loop carries student verification and ratings across listings and
          rides. Verification badges reflect each member's Loop account.
        </LoopText>
      </LoopCard>
    </LoopScreen>
  );
}
