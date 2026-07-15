import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for dashboard page
export const metadata = {
  title: "Dashboard | Medivance",
  description: "View your patient overview and recent activity",
};

// dynamically import the DoctorDashboardPage component with a loading state
const DoctorDashboardPage = dynamic(
  () =>
    import("@/features/doctor/components/dashboard/doctor-dashboard-page").then(
      (m) => m.DoctorDashboardPage,
    ),
  { loading: () => <PulseLoader /> },
);

// doctor dashboard page component
export default function Page() {
  return <DoctorDashboardPage />;
}
