"use client";

import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageShell, AdminTabs } from "../shared";
import {
  useFileAccessLogs,
  useGeoLogins,
  useHeatmap,
} from "../../hooks/use-analytics";
import { AnalyticsHeatmapTab } from "./analytics-heatmap-tab";
import { AnalyticsFileAccessTab } from "./analytics-file-access-tab";
import { AnalyticsGeoTab } from "./analytics-geo-tab";

// tabs for the analytics page
type AnalyticsTab = "heatmap" | "file-access" | "geo";

const INSIGHT_SAMPLE_SIZE = 200;

// analytics page
export function AnalyticsPage() {
  // state
  const [tab, setTab] = useState<AnalyticsTab>("heatmap");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filePage, setFilePage] = useState(1);
  const [entityFilter, setEntityFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // filters
  const dateFilters = {
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  };

  // hooks
  const { data: heatmapData, isLoading: heatmapLoading } =
    useHeatmap(dateFilters);

  const { data: fileData, isFetching: fileFetching } = useFileAccessLogs({
    ...dateFilters,
    page: filePage,
    entity: entityFilter !== "all" ? entityFilter : undefined,
    actor_id: actorFilter?.id,
  });

  const { data: insightData, isLoading: insightLoading } = useFileAccessLogs({
    ...dateFilters,
    page: 1,
    limit: INSIGHT_SAMPLE_SIZE,
  });

  // geo logins hook
  const { data: geoData, isLoading: geoLoading } = useGeoLogins(dateFilters);

  // tabs
  const tabs = [
    { id: "heatmap" as const, label: "Activity Heatmap" },
    { id: "file-access" as const, label: "File Access" },
    { id: "geo" as const, label: "Geo Logins" },
  ];

  // date range
  const dateRangeFilter = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1.5">
        <CalendarRange className="w-4 h-4 text-gray-400 shrink-0" />
        <div className="space-y-0.5">
          <Label
            htmlFor="from-date"
            className="text-[10px] uppercase tracking-wide text-gray-400"
          >
            From
          </Label>
          <Input
            id="from-date"
            type="date"
            className="h-6 border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1.5">
        <CalendarRange className="w-4 h-4 text-gray-400 shrink-0" />
        <div className="space-y-0.5">
          <Label
            htmlFor="to-date"
            className="text-[10px] uppercase tracking-wide text-gray-400"
          >
            To
          </Label>
          <Input
            id="to-date"
            type="date"
            className="h-6 border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <AdminPageShell
      title="Analytics"
      description="System activity insights, file access monitoring and login geography"
    >
      {dateRangeFilter}
      {/* tabs */}
      <AdminTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* heatmap tab */}
      {tab === "heatmap" && (
        <AnalyticsHeatmapTab
          heatmapData={heatmapData}
          heatmapLoading={heatmapLoading}
        />
      )}

      {/* file access tab */}
      {tab === "file-access" && (
        <AnalyticsFileAccessTab
          fileData={fileData}
          fileFetching={fileFetching}
          entityFilter={entityFilter}
          onEntityFilterChange={(v) => {
            setEntityFilter(v);
            setFilePage(1);
          }}
          filePage={filePage}
          onFilePageChange={setFilePage}
          insightData={insightData}
          insightLoading={insightLoading}
          actorFilter={actorFilter}
          onActorFilterChange={(f) => {
            setActorFilter(f);
            setFilePage(1);
          }}
        />
      )}

      {/* geo login tab */}
      {tab === "geo" && (
        <AnalyticsGeoTab geoData={geoData} geoLoading={geoLoading} />
      )}
    </AdminPageShell>
  );
}
