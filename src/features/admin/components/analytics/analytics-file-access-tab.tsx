"use client";

// File Access tab of the analytics page — real log table plus a set of
import { useMemo } from "react";
import {
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatFullTimestamp,
  formatRelativeTime,
} from "@/lib/utils/date-format";
import {
  AdminTableShell,
  DonutChart,
  MetricCard,
  MetricGrid,
  MiniBar,
  TrendAreaChart,
  type DonutSegment,
} from "../shared";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import type { useFileAccessLogs } from "../../hooks/use-analytics";
import type { FileAccessLog } from "@/lib/types/admin-features";

type ActorFilter = { id: number; name: string } | null;

type Alert = {
  id: string;
  severity: "high" | "medium";
  title: string;
  description: string;
  actorId: number | null;
  actorName: string | null;
  timeLabel: string;
};

// it's computed straight from whatever the API returned for the sample
function buildInsights(logs: FileAccessLog[]) {
  const roleCounts = new Map<string, number>();
  const entityCounts = new Map<string, number>();
  const dayCounts = new Map<string, number>();
  const actorCounts = new Map<
    string,
    { id: number; name: string; count: number }
  >();
  const uniqueActors = new Set<number>();
  const alerts: Alert[] = [];

  logs.forEach((log, index) => {
    const role = log.actor_role ?? "Unknown";
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);

    entityCounts.set(log.entity, (entityCounts.get(log.entity) ?? 0) + 1);

    const day = log.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);

    if (log.actor_id) {
      uniqueActors.add(log.actor_id);
      const key = String(log.actor_id);
      const existing = actorCounts.get(key);
      actorCounts.set(key, {
        id: log.actor_id,
        name: log.actor_name ?? `User #${log.actor_id}`,
        count: (existing?.count ?? 0) + 1,
      });
    }

    // off-hours heuristic — access between 00:00 and 06:00
    const hour = new Date(log.created_at).getHours();
    if (hour >= 0 && hour < 6) {
      alerts.push({
        id: `offhours-${log.audit_log_id ?? "log"}-${index}`,
        severity: "medium",
        title: "Off-Hours Access",
        description: `${log.actor_name ?? "A user"} accessed a ${log.entity.toLowerCase()} at ${new Date(
          log.created_at,
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}, outside standard hours.`,
        actorId: log.actor_id,
        actorName: log.actor_name,
        timeLabel: formatRelativeTime(log.created_at),
      });
    }
  });

  // share of the sampled accesses
  for (const actor of actorCounts.values()) {
    if (actor.count >= 15) {
      alerts.push({
        id: `volume-${actor.id}`,
        severity: "high",
        title: "High-Volume Access Pattern",
        description: `${actor.name} accounts for ${actor.count} file accesses in the current sample.`,
        actorId: actor.id,
        actorName: actor.name,
        timeLabel: "Recent activity",
      });
    }
  }

  alerts.sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === "high" ? -1 : 1,
  );

  return {
    roleCounts,
    entityCounts,
    dayCounts,
    uniqueActors,
    alerts: alerts.slice(0, 5),
  };
}

const ROLE_COLORS: { color: string; stroke: string }[] = [
  { color: "bg-emerald-600", stroke: "oklch(0.596 0.145 163.225)" },
  { color: "bg-sky-500", stroke: "oklch(0.65 0.15 240)" },
  { color: "bg-violet-500", stroke: "oklch(0.606 0.15 291)" },
  { color: "bg-amber-500", stroke: "oklch(0.72 0.15 70)" },
];

export function AnalyticsFileAccessTab({
  fileData,
  fileFetching,
  entityFilter,
  onEntityFilterChange,
  filePage,
  onFilePageChange,
  insightData,
  insightLoading,
  actorFilter,
  onActorFilterChange,
}: {
  fileData: ReturnType<typeof useFileAccessLogs>["data"];
  fileFetching: boolean;
  entityFilter: string;
  onEntityFilterChange: (value: string) => void;
  filePage: number;
  onFilePageChange: (page: number) => void;
  insightData: ReturnType<typeof useFileAccessLogs>["data"];
  insightLoading: boolean;
  actorFilter: ActorFilter;
  onActorFilterChange: (filter: ActorFilter) => void;
}) {
  const insights = useMemo(
    () => buildInsights(insightData?.data ?? []),
    [insightData],
  );

  const roleSegments: DonutSegment[] = Array.from(
    insights.roleCounts.entries(),
  ).map(([role, count], i) => ({
    label: role,
    value: count,
    ...ROLE_COLORS[i % ROLE_COLORS.length],
  }));

  const entityEntries = Array.from(insights.entityCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  const entityMax = entityEntries[0]?.[1] ?? 1;

  const trendPoints = Array.from(insights.dayCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, count]) => ({
      label: new Date(day).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      }),
      value: count,
    }));

  return (
    <div className="space-y-4">
      {/* headline KPIs */}
      <MetricGrid cols={3}>
        <MetricCard
          label="Total File Accesses"
          value={fileData?.total ?? 0}
          icon={Shield}
        />
        <MetricCard
          label="Unique Users"
          value={insights.uniqueActors.size}
          icon={Users}
          sublabel={
            insightData?.data.length
              ? `across last ${insightData.data.length} logs`
              : undefined
          }
        />
        <MetricCard
          label="Flagged Patterns"
          value={insights.alerts.length}
          icon={AlertTriangle}
          danger={insights.alerts.length > 0}
          sublabel="Off-hours & high-volume access"
        />
      </MetricGrid>

      {/* volume trend + breakdowns */}
      {!insightLoading && trendPoints.length > 1 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Access Volume Trend
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Daily accesses across the sampled logs
            </p>
            <TrendAreaChart data={trendPoints} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Access by Entity Type
            </p>
            {entityEntries.map(([entity, count]) => (
              <MiniBar
                key={entity}
                label={entity}
                value={count}
                max={entityMax}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* access by role */}
        <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Access by Role
          </p>
          {insightLoading ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Loading…
            </div>
          ) : roleSegments.length === 0 ? (
            <EmptyState icon={Users} title="No role data" />
          ) : (
            <DonutChart
              data={roleSegments}
              centerValue={roleSegments.length}
              centerLabel={roleSegments.length === 1 ? "Role" : "Roles"}
            />
          )}
        </div>

        {/* suspicious activity */}
        <div className="xl:col-span-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Suspicious Activity
              </p>
            </div>
            <span className="text-xs font-medium text-red-600">
              {insights.alerts.length} flagged
            </span>
          </div>

          {insights.alerts.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No unusual patterns detected"
              description="Off-hours access and high-volume patterns will show up here."
            />
          ) : (
            <div className="space-y-2">
              {insights.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={
                            alert.severity === "high"
                              ? "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400"
                              : "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
                          }
                        >
                          {alert.severity === "high" ? (
                            <Zap className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {alert.severity === "high" ? "High" : "Medium"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {alert.timeLabel}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {alert.description}
                      </p>
                    </div>
                    {alert.actorId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() =>
                          onActorFilterChange({
                            id: alert.actorId as number,
                            name: alert.actorName ?? `User #${alert.actorId}`,
                          })
                        }
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={entityFilter} onValueChange={onEntityFilterChange}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Image">Images</SelectItem>
            <SelectItem value="Report">Reports</SelectItem>
          </SelectContent>
        </Select>

        {actorFilter && (
          <button
            type="button"
            onClick={() => onActorFilterChange(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            Actor: {actorFilter.name}
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* file access logs */}
      <AdminTableShell isFetching={fileFetching}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-800">
              {["Timestamp", "Actor", "Entity", "Description", "IP"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 first:pl-4"
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!fileData?.data.length ? (
              <TableRow>
                {/* empty state */}
                <TableCell colSpan={5} className="py-10">
                  <EmptyState
                    icon={Shield}
                    title="No file access logs"
                    description="No file access activity recorded."
                  />
                </TableCell>
              </TableRow>
            ) : (
              fileData.data.map((log, i) => {
                const isReport = log.entity === "Report";
                const initial = (log.actor_name ?? "?").charAt(0).toUpperCase();

                return (
                  <TableRow
                    key={`${log.audit_log_id}-${i}`}
                    className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-900 dark:hover:bg-gray-900/50"
                  >
                    {/* created at */}
                    <TableCell className="pl-4 py-3 text-sm tabular-nums whitespace-nowrap text-gray-500 dark:text-gray-500">
                      {formatFullTimestamp(log.created_at)}
                    </TableCell>

                    {/* actor name */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          {initial}
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {log.actor_name ?? "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* entity */}
                    <TableCell className="py-3">
                      <span
                        className={
                          isReport
                            ? "inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-400"
                            : "inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400"
                        }
                      >
                        {isReport ? (
                          <FileText className="h-3 w-3" />
                        ) : (
                          <Zap className="h-3 w-3" />
                        )}
                        {log.entity}
                      </span>
                    </TableCell>

                    {/* description */}
                    <TableCell className="py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {log.description ?? "—"}
                    </TableCell>

                    {/* ip address */}
                    <TableCell className="py-3">
                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        {log.ip_address ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </AdminTableShell>

      {/* pagination */}
      {fileData?.data.length && (
        <PaginationWrapper
          totalPages={fileData?.pages ?? 1}
          currentPage={filePage}
          onPageChange={onFilePageChange}
        />
      )}
    </div>
  );
}
