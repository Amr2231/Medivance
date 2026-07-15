import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for schedule page
export const metadata = {
  title: "Schedule | Medivance",
  description:
    "View and manage your upcoming appointments and schedule in the Doctor Portal",
};

// dynamically import the SchedulePage component with a loading state
const SchedulePage = dynamic(
  () =>
    import("@/features/doctor/components/schedule/schedule-page").then(
      (m) => m.SchedulePage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the SchedulePage
export default function Page() {
  return <SchedulePage />;
}
