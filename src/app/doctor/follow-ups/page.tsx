import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for follow-ups page
export const metadata = {
  title: "Follow-ups | Medivance",
  description: "Manage and review your patient follow-ups",
};

// dynamically import the FollowUpsPage component with a loading state
const FollowUpsPage = dynamic(
  () =>
    import("@/features/doctor/components/follow-ups/follow-ups-page").then(
      (m) => m.FollowUpsPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the FollowUpsPage
export default function Page() {
  return <FollowUpsPage />;
}
