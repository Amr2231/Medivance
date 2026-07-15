import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for patients page
export const metadata = {
  title: "Patients | Medivance",
  description:
    "View and manage your active, recent, historical, and watchlisted patients",
};

// dynamically import the PatientsHubPage component with a loading state
const PatientsHubPage = dynamic(
  () =>
    import("@/features/doctor/components/patients/patients-hub-page").then(
      (m) => m.PatientsHubPage,
    ),
  { loading: () => <PulseLoader /> },
);

// valid tabs — anything else falls back to "active"
const VALID_TABS = ["active", "recent", "historical", "watchlist"] as const;
type PatientsTab = (typeof VALID_TABS)[number];

// patients page — combines Active / Recent / Historical / Watchlist into tabs
export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: PatientsTab = VALID_TABS.includes(tab as PatientsTab)
    ? (tab as PatientsTab)
    : "active";

  return <PatientsHubPage initialTab={initialTab} />;
}
