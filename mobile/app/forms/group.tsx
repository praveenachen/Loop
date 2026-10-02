import { router } from "expo-router";
import { LoopForm } from "../../components/LoopForm";
import { groupFields } from "../../lib/forms";
import { useLoop } from "../../lib/AppProvider";
export default function CreateGroup() {
  const { mutate } = useLoop();
  return (
    <LoopForm
      title="Create Study Group"
      description="Set a course, time, and focus so classmates can find your session."
      fields={groupFields}
      initialValues={{ seatsLeft: "1" }}
      submitLabel="Publish Group"
      variant="study"
      fallback="/study"
      onSubmit={async (v) => {
        const { id } = await mutate("/api/study-groups", { ...v, seatsLeft: Number(v.seatsLeft) });
        router.replace({ pathname: "/groups/[id]", params: { id, created: "1" } });
      }}
    />
  );
}
