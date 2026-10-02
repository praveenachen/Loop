import { router } from "expo-router";
import { LoopForm } from "../../components/LoopForm";
import { profileFields } from "../../lib/forms";
import { useLoop } from "../../lib/AppProvider";
export default function EditProfile() {
  const { data, mutate } = useLoop();
  const { name, program, year, avatar } = data.user;
  return (
    <LoopForm
      title="Edit Profile"
      description="Update your campus profile."
      fields={profileFields}
      initialValues={{ name, program, year, avatar }}
      submitLabel="Save Changes"
      fallback="/profile"
      onSubmit={async (v) => {
        await mutate("/api/profile/me", v, "PATCH");
        if (router.canGoBack()) router.back();
        else router.replace("/profile");
      }}
    />
  );
}
