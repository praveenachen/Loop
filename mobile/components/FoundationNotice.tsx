import { LoopCard } from "./LoopCard";
import { LoopText } from "./LoopText";
import { colors } from "../theme";
export function FoundationNotice({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <LoopCard style={{ backgroundColor: colors.surfaceSoft }}>
      <LoopText variant="cardHeading">{title}</LoopText>
      <LoopText variant="smallBody">{children}</LoopText>
    </LoopCard>
  );
}
