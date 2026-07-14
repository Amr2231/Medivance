"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ActivePatientsTable } from "./active-patients-table";
import { HistoricalPatientsTable } from "./historical-patients-table";
import { DoctorPageShell, DoctorTabs, DoctorLoadingState } from "../shared/ui";

// Lazy-load the two heavier tabs — same code-splitting behaviour the
// standalone /doctor/recent-patients and /doctor/watchlist routes used to have.
const RecentPatientsTable = dynamic(
  () =>
    import("../recent-patients/recent-patients-table").then(
      (m) => m.RecentPatientsTable,
    ),
  { loading: () => <DoctorLoadingState /> },
);
const WatchlistTable = dynamic(
  () =>
    import("../watchlist/watchlist-table").then((m) => m.WatchlistTable),
  { loading: () => <DoctorLoadingState /> },
);

type PatientsTab = "active" | "recent" | "historical" | "watchlist";

const TAB_META: Record<PatientsTab, { label: string; description: string }> = {
  active: {
    label: "Active",
    description: "View and manage your assigned patients",
  },
  recent: {
    label: "Recent",
    description: "Last viewed patients from your activity",
  },
  historical: {
    label: "Historical",
    description: "View all completed patient records",
  },
  watchlist: {
    label: "Watchlist",
    description: "Starred patients requiring close monitoring",
  },
};

const TABS: { id: PatientsTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "recent", label: "Recent" },
  { id: "historical", label: "Historical" },
  { id: "watchlist", label: "Watchlist" },
];

// component
export function PatientsHubPage({
  initialTab = "active",
}: {
  initialTab?: PatientsTab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<PatientsTab>(initialTab);

  const handleChange = useCallback(
    (id: PatientsTab) => {
      setTab(id);
      // keep the URL in sync so the tab survives a refresh / can be shared,
      // without adding a history entry per click
      router.replace(
        id === "active" ? "/doctor/patients" : `/doctor/patients?tab=${id}`,
        { scroll: false },
      );
    },
    [router],
  );

  return (
    <DoctorPageShell title="Patients" description={TAB_META[tab].description}>
      <DoctorTabs tabs={TABS} active={tab} onChange={handleChange} />

      {tab === "active" && <ActivePatientsTable />}
      {tab === "recent" && <RecentPatientsTable />}
      {tab === "historical" && <HistoricalPatientsTable />}
      {tab === "watchlist" && <WatchlistTable />}
    </DoctorPageShell>
  );
}
