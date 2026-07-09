"use client";

// Activity Heatmap tab of the analytics page.

import { Fragment } from "react";
import { BarChart3, Clock, Flame, TrendingUp } from "lucide-react";
import { AdminLoadingState, MetricCard, MetricGrid, MiniBar } from "../shared";
import type { useHeatmap } from "../../hooks/use-analytics";

// days of the week
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// heatmap grid
function HeatmapGrid({
  matrix,
}: {
  matrix: { hour_of_day: number; day_of_week: number; count: number }[];
}) {
  // get the max count
  const max = Math.max(...matrix.map((m) => m.count), 1);

  // get the count for a day and hour
  const getCount = (day: number, hour: number) =>
    matrix.find((m) => m.day_of_week === day && m.hour_of_day === hour)
      ?.count ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 overflow-x-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Activity Heatmap
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span>Less</span>
          {[0.1, 0.3, 0.55, 0.8, 1].map((o) => (
            <span
              key={o}
              className="w-2.5 h-2.5 rounded-sm bg-[#059669]"
              style={{ opacity: o }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* grid for the heatmap */}
      <div className="min-w-150">
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5">
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="text-[9px] text-gray-400 text-center">
              {h}
            </div>
          ))}

          {/* days of the week */}
          {DAYS.map((day, dayIdx) => (
            <Fragment key={day}>
              <div className="text-xs text-gray-500 flex items-center">
                {day}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const count = getCount(dayIdx, hour);
                const opacity = count > 0 ? Math.max(0.15, count / max) : 0.05;
                return (
                  <div
                    key={`${dayIdx}-${hour}`}
                    title={`${day} ${hour}:00 — ${count} actions`}
                    className="aspect-square rounded-sm bg-[#059669] transition-opacity hover:ring-1 hover:ring-emerald-400"
                    style={{ opacity }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsHeatmapTab({
  heatmapData,
  heatmapLoading,
}: {
  heatmapData: ReturnType<typeof useHeatmap>["data"];
  heatmapLoading: boolean;
}) {
  if (heatmapLoading) return <AdminLoadingState />;
  if (!heatmapData?.data) return null;

  const { matrix, top_actors, action_breakdown } = heatmapData.data;

  // peak hour / day — derived straight from the real matrix, no new fetch
  const peakCell = matrix.reduce(
    (best, cell) => (cell.count > best.count ? cell : best),
    { hour_of_day: 0, day_of_week: 0, count: 0 },
  );
  const totalActions = matrix.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-4">
      {/* overview KPIs */}
      <MetricGrid cols={3}>
        <MetricCard
          label="Total Tracked Actions"
          value={totalActions}
          icon={TrendingUp}
        />
        <MetricCard
          label="Peak Activity Window"
          value={
            peakCell.count > 0
              ? `${DAYS[peakCell.day_of_week]} ${peakCell.hour_of_day}:00`
              : "—"
          }
          icon={Flame}
          sublabel={peakCell.count > 0 ? `${peakCell.count} actions` : undefined}
        />
        <MetricCard
          label="Most Active User"
          value={top_actors[0]?.actor_name ?? "—"}
          icon={Clock}
          sublabel={top_actors[0]?.actor_role}
        />
      </MetricGrid>

      {/* top actors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {top_actors.slice(0, 4).map((a, i) => (
          <MetricCard
            key={`${a.actor_id}-${i}`}
            label={a.actor_name}
            value={a.total_actions}
            icon={BarChart3}
            sublabel={a.actor_role}
          />
        ))}
      </div>

      {/* heatmap grid for actions */}
      <HeatmapGrid matrix={matrix} />

      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Action Breakdown
        </p>

        {/* action breakdown */}
        {action_breakdown.slice(0, 8).map((a) => (
          <MiniBar
            key={a.action}
            label={a.action.replace(/_/g, " ")}
            value={a.count}
            max={action_breakdown[0]?.count ?? 1}
          />
        ))}
      </div>
    </div>
  );
}
