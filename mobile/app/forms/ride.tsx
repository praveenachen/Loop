import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LoopForm } from "../../components/LoopForm";
import { LoopTabs } from "../../components";
import { rideFields } from "../../lib/forms";
import { useLoop } from "../../lib/AppProvider";
export default function CreateRide() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState(
    params.mode === "request" ? "request" : "offer",
  );
  const { mutate } = useLoop();
  const fields = rideFields.map((f) =>
    f.key === "seats"
      ? { ...f, label: mode === "offer" ? "Seats available" : "Seats needed" }
      : f.key === "car"
        ? {
            ...f,
            label: mode === "offer" ? "Vehicle" : "Ride preference",
            placeholder:
              mode === "offer" ? "Honda Civic 2020" : "Any verified driver",
          }
        : f,
  );
  return (
    <LoopForm
      title={mode === "offer" ? "Offer a Trip" : "Request a Trip"}
      description={
        mode === "offer"
          ? "Share your route and available seats with verified students."
          : "Post the route and time you need a ride."
      }
      fields={fields}
      initialValues={{ pricePerSeat: "0", seats: "1" }}
      submitLabel={mode === "offer" ? "Publish Offer" : "Publish Request"}
      variant="rides"
      fallback="/rides"
      onSubmit={async (v) => {
        const { id } = await mutate("/api/rides", { ...v, pricePerSeat: Number(v.pricePerSeat), seats: Number(v.seats), mode: mode.toUpperCase() });
        router.replace({ pathname: "/ride/[id]", params: { id, created: "1" } });
      }}
    >
      <LoopTabs
        items={["Offer a ride", "Request a ride"]}
        active={mode === "offer" ? "Offer a ride" : "Request a ride"}
        onChange={(v) => setMode(v === "Offer a ride" ? "offer" : "request")}
      />
    </LoopForm>
  );
}
