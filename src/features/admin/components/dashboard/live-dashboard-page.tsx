"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";
import { FileText, Users, Wifi } from "lucide-react";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  BarChart,
  DonutChart,
  HeroStatCard,
  type DonutSegment,
} from "../shared";
import { useDashboard } from "../../hooks/use-dashboard";
import { SecurityCenterCard } from "./security-center-card";
import { SystemActivityCard } from "./system-activity-card";

// dynamically import the LiveIndicator component
const LiveIndicator = dynamic(
  () => import("./live-indicator").then((m) => ({ default: m.LiveIndicator })),
  { ssr: false },
);

// colors cycled across the "Users by Role" donut segments
const ROLE_COLORS: { color: string; stroke: string }[] = [
  { color: "bg-emerald-600", stroke: "oklch(0.596 0.145 163.225)" },
  { color: "bg-teal-500", stroke: "oklch(0.704 0.14 182.503)" },
  { color: "bg-violet-500", stroke: "oklch(0.606 0.15 291)" },
  { color: "bg-amber-500", stroke: "oklch(0.72 0.15 70)" },
];

// live dashboard page
export function LiveDashboardPage() {
  // fetch dashboard data
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useDashboard();
  const dashboard = data?.data;

  // Loading state
  if (isLoading) return <AdminLoadingState />;
  // Error state
  if (isError || !dashboard) {
    return (
      <AdminPageShell
        title="Live Dashboard"
        description="Real-time system overview"
      >
        {/* render error state */}
        <AdminErrorState onRetry={() => refetch()} />
      </AdminPageShell>
    );
  }

  // destructure dashboard data
  const { users, studies, reports } = dashboard;

  const roleSegments: DonutSegment[] = users.by_role.map((r, i) => ({
    label: r.role_name,
    value: r.count,
    ...ROLE_COLORS[i % ROLE_COLORS.length],
  }));

  return (
    <AdminPageShell
      title="Live Dashboard"
      description="Real-time system health and activity overview"
      actions={
        <div className="flex flex-col items-start gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-3 ">
          {/* render live indicator */}
          <LiveIndicator />
          <span className="tabular-nums">
            Updated {formatFullTimestamp(new Date(dataUpdatedAt).toISOString())}
          </span>
        </div>
      }
    >
      {/* hero KPI row */}
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <motion.div variants={staggerItem}>
          <HeroStatCard
            label="Total Users"
            value={users.total_users}
            icon={Users}
            sublabel={`+${users.new_today} new today`}
            progress={
              users.total_users > 0
                ? (users.active_users / users.total_users) * 100
                : 0
            }
            footnote={`${users.active_users} active of ${users.total_users} total`}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <HeroStatCard
            label="Online Now"
            value={users.online_now}
            icon={Wifi}
            sublabel="currently active"
            footnote={`${users.active_users} active users this period`}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <HeroStatCard
            label="Reports Signed"
            value={reports.signed}
            icon={FileText}
            sublabel={`+${reports.today} today`}
            progress={reports.total_reports > 0 ? (reports.signed / reports.total_reports) * 100 : 0}
            footnote={`${reports.written} written of ${reports.total_reports} total`}
          />
        </motion.div>
      </motion.div>

      {/* main content: activity trend + status  |  security + system activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <div className="xl:col-span-2 space-y-4">
          <BarChart
            title="Images — Last 7 Days"
            data={studies.last_7_days.map((d) => ({
              label: new Date(d.day).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              }),
              value: d.count,
            }))}
          />

          {/* users by role */}
          <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 transition-shadow duration-200 hover:shadow-glow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Users className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Users by Role
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
                {users.by_role.length} roles
              </span>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="shrink-0">
                <DonutChart
                  data={roleSegments}
                  centerValue={users.total_users}
                  centerLabel="total users"
                />
              </div>

              <motion.div
                variants={staggerContainer(0.05)}
                initial="hidden"
                animate="show"
                className="flex w-full flex-1 flex-col gap-3.5"
              >
                {roleSegments.map((segment) => {
                  const percentage =
                    users.total_users > 0
                      ? Math.round((segment.value / users.total_users) * 100)
                      : 0;

                  return (
                    <motion.div key={segment.label} variants={staggerItem}>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${segment.color}`}
                            aria-hidden="true"
                          />
                          {segment.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 tabular-nums">
                          {segment.value} · {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                        <motion.div
                          className={`h-full rounded-full ${segment.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SecurityCenterCard />
          <SystemActivityCard />
        </div>
      </div>
    </AdminPageShell>
  );
}
