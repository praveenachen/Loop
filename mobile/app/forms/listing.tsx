import { router } from "expo-router";
import { LoopForm } from "../../components/LoopForm";
import { listingFields } from "../../lib/forms";
import { useLoop } from "../../lib/AppProvider";
export default function CreateListing() {
  const { mutate } = useLoop();
  return (
    <LoopForm
      title="Create Marketplace Listing"
      description={'Selling something? Use a category like Electronics. Looking for something? Set the category to "Requests" so it shows as Wanted.'}
      fields={listingFields}
      initialValues={{ price: "0" }}
      submitLabel="Publish Listing"
      variant="marketplace"
      fallback="/marketplace"
      onSubmit={async (v) => {
        const { id } = await mutate("/api/marketplace/listings", { ...v, price: Number(v.price) });
        router.replace({ pathname: "/listings/[id]", params: { id, created: "1" } });
      }}
    />
  );
}
