import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for analytics page
export const metadata = {
  title: "Analytics | Medivance",
  description: "View your performance metrics and patient analytics",
};

// dynamically import the DoctorAnalyticsPage component with a loading state
const DoctorAnalyticsPage = dynamic(
  () =>
    import("@/features/doctor/components/analytics/doctor-analytics-page").then(
      (m) => m.DoctorAnalyticsPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the DoctorAnalyticsPage
export default function Page() {
  return <DoctorAnalyticsPage />;
}
