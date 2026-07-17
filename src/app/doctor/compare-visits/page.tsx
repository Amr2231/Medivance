import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for compare visits page
export const metadata = {
  title: "Compare Visits | Medivance",
  description:
    "Compare patient visits side by side to track progress and outcomes",
};

// dynamically import the CompareVisitsPage component with a loading state
const CompareVisitsPage = dynamic(
  () =>
    import("@/features/doctor/components/compare-visits/compare-visits-page").then(
      (m) => m.CompareVisitsPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the CompareVisitsPage — a national ID in the query string (e.g.
// linked from a patient's profile) preselects that patient in "Visit A"'s
// search so the doctor doesn't have to re-type it.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ nationalId?: string }>;
}) {
  const { nationalId } = await searchParams;
  return <CompareVisitsPage initialNationalId={nationalId} />;
}
