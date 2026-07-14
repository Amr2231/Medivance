"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Clock,
  FileText,
  ListChecks,
  Star,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import { formatFullTimestamp, formatTimeOnly } from "@/lib/utils/date-format";
import {
  formatReportStatusLabel,
  normalizeReportStatus,
} from "@/features/doctor/utils/report-status";
import { staggerItem } from "@/lib/motion/variants";
import {
  BarChart,
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
} from "../shared/ui";
import { useDoctorDashboard } from "../../hooks/use-dashboard";
import { EmptyState } from "@/components/ui/empty-state";

/** "Good morning / afternoon / evening" based on the viewer's local clock. */
function useTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Compact "at-a-glance" row used inside the hero — an icon chip, a value,
 * and a label on one line, so headline numbers live inside the greeting
 * card instead of floating in separate boxes beside it. */
function HeroStatRow({
  value,
  label,
  icon: Icon,
  tone = "brand",
}: {
  value: number | string;
  label: string;
  icon: LucideIcon;
  tone?: "brand" | "danger";
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          tone === "danger"
            ? "bg-red-100 dark:bg-red-950/40"
            : "bg-[image:var(--brand-gradient-soft)]",
        )}
      >
        <Icon
          className={cn(
            "size-4",
            tone === "danger"
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-700 dark:text-emerald-300",
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-lg font-bold leading-tight tabular-nums text-foreground">
          {value}
        </p>
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/** Ring gauge for a 0-100 percentage that gives clinical metrics a visual
 * identity of its own instead of being just another number in a box. */
function RadialGauge({ value, size = 128 }: { value: number; size?: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-muted"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-emerald-600 transition-[stroke-dashoffset] duration-700 ease-out dark:stroke-emerald-400"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
          {clamped}%
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Follow-up
        </span>
      </div>
    </div>
  );
}

// doctor dashboard page component
export function DoctorDashboardPage() {
  // custom hook
  const { data, isLoading, isError, refetch, dataUpdatedAt } =
    useDoctorDashboard();
  const { data: session } = useSession();
  const greeting = useTimeOfDayGreeting();
  const [watchlistFilter, setWatchlistFilter] = useState<"all" | "critical">(
    "all",
  );

  // Handle loading state by showing a loading component while the dashboard data is being fetched
  if (isLoading) return <DoctorLoadingState />;
  if (isError || !data?.stats) {
    return (
      <DoctorPageShell title="Dashboard" description="Your clinical overview">
        <DoctorErrorState onRetry={() => refetch()} />
      </DoctorPageShell>
    );
  }

  // Destructure necessary data from the dashboard query result for easier access in the component
  const {
    stats,
    recent_patients,
    today_schedule,
    upcoming_followups,
    watchlist,
  } = data;

  const doctorName = session?.user?.name?.split(" ")[0] ?? "Doctor";

  // Reports still awaiting the doctor's sign-off, out of the recent
  // patients preview — a real, derived count rather than a placeholder.
  const pendingReportsCount = recent_patients.filter(
    (p) => normalizeReportStatus(p.report_status) !== "signed",
  ).length;

  const filteredWatchlist =
    watchlistFilter === "critical"
      ? watchlist.filter((w) => w.priority === "critical")
      : watchlist;

  // Today's studies grouped by type, for the activity bar chart below.
  const scheduleActivityCounts = new Map<string, number>();
  for (const s of today_schedule) {
    scheduleActivityCounts.set(
      s.study_type,
      (scheduleActivityCounts.get(s.study_type) ?? 0) + 1,
    );
  }
  const scheduleActivity = Array.from(scheduleActivityCounts.entries()).map(
    ([label, value]) => ({ label, value }),
  );

  // Render the dashboard page
  return (
    <DoctorPageShell
      title="Dashboard"
      description="Your clinical overview for today"
      actions={
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          Updated {formatFullTimestamp(new Date(dataUpdatedAt).toISOString())}
        </span>
      }
    >
      {/* Greeting hero — headline numbers now live inside the card as a
          compact "at a glance" strip instead of floating beside it */}
      <motion.div
        variants={staggerItem}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div
          aria-hidden
          className="ambient-blob absolute -right-20 -top-24 size-72 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "var(--brand-gradient)" }}
        />
        <div
          aria-hidden
          className="ambient-blob absolute -bottom-24 -left-16 size-56 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {greeting}, Dr. {doctorName}.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You have{" "}
              <span className="font-semibold text-foreground">
                {today_schedule.length} patient
                {today_schedule.length === 1 ? "" : "s"}
              </span>{" "}
              scheduled today and{" "}
              <span className="font-semibold text-foreground">
                {watchlist.length} on your watchlist
              </span>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button asChild size="sm">
                <Link href="/doctor/schedule">
                  <CalendarClock />
                  View Today&apos;s Schedule
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/doctor/patients?tab=watchlist">
                  <ListChecks />
                  Open Watchlist
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="shrink-0 divide-y divide-border rounded-2xl border border-border bg-background/60 px-4 sm:min-w-56">
            <HeroStatRow
              value={stats.patients_today}
              label="Patients Today"
              icon={Stethoscope}
            />
            <HeroStatRow
              value={pendingReportsCount}
              label="Pending Reports"
              icon={FileText}
              tone="danger"
            />
          </div>
        </div>
      </motion.div>

      {/* Bento row: task list, timeline, and an at-a-glance insights panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Watchlist, styled as a scannable task table with a plain
            all/critical toggle — critical patients need to jump out. */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ListChecks className="size-4 text-muted-foreground" />
              Watchlist
            </h2>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setWatchlistFilter("all")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  watchlistFilter === "all"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setWatchlistFilter("critical")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  watchlistFilter === "critical"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Critical
              </button>
            </div>
          </div>
          {watchlist.length === 0 ? (
            <EmptyState
              title="Your watchlist is empty"
              description="Add patients to your watchlist to easily track their status and receive follow-up reminders."
              icon={Star}
            />
          ) : filteredWatchlist.length === 0 ? (
            <EmptyState
              title="No critical patients"
              description="Nobody on your watchlist is currently flagged critical."
              icon={Star}
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-semibold">Patient</th>
                  <th className="pb-2 font-semibold">Note</th>
                  <th className="pb-2 pl-2 text-right font-semibold">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWatchlist.map((w) => (
                  <tr
                    key={w.national_id}
                    className="border-b border-border last:border-0 hover:bg-accent/50"
                  >
                    <td className="py-2.5 pr-2">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            w.priority === "critical"
                              ? "bg-red-600"
                              : w.priority === "monitor"
                                ? "bg-amber-500"
                                : "bg-emerald-600",
                          )}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {w.first_name} {w.last_name}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-xs text-muted-foreground">
                      <span className="line-clamp-1">
                        {w.note || "No note"}
                      </span>
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          w.priority === "critical"
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                            : "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {w.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Today's Schedule, as a time-anchored timeline */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col lg:col-span-4">
          <div className="mb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="size-4 text-muted-foreground" />
              Today&apos;s Schedule
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {today_schedule.length === 0 ? (
            <EmptyState
              title="No scheduled patients for today"
              description="You have no patients scheduled for today. Check your schedule later or add new appointments."
              icon={Stethoscope}
            />
          ) : (
            <ul className="relative flex-1 space-y-3.5">
              <span
                aria-hidden
                className="absolute left-[27px] top-1.5 bottom-1.5 w-px bg-border"
              />
              {today_schedule.slice(0, 5).map((item) => (
                <li key={item.study_id} className="relative flex gap-3 pl-0">
                  <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                      {formatTimeOnly(item.study_date)}
                    </span>
                    <span
                      aria-hidden
                      className="relative z-10 mt-1.5 size-2.5 rounded-full bg-[image:var(--brand-gradient)] ring-4 ring-card"
                    />
                  </div>
                  <Link
                    href={`/doctor/patients/${item.study_id}/report`}
                    className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.first_name} {item.last_name}
                    </p>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {item.study_type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/doctor/schedule"
            className="mt-4 block rounded-lg py-2 text-center text-xs font-semibold text-primary hover:bg-accent/50"
          >
            View Full Calendar
          </Link>
        </section>

        {/* Insights panel with a gauge and two supporting
            stats — a distinct visual identity instead of a plain number grid */}
        <section className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm lg:col-span-3">
          <h2 className="self-start flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <Activity className="size-4 text-muted-foreground" />
            Clinical Insights
          </h2>
          <RadialGauge value={stats.followup_completion_pct} />
          <div className="mt-3 w-full divide-y divide-border border-t border-border">
            <div className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                Images this month
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {stats.prescriptions_month}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="size-3.5" />
                Follow-up rate
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {stats.followup_completion_pct}%
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Patients + Follow-up Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Patients */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Patients
            </h2>
            {/* view all */}
            <Link
              href="/doctor/patients?tab=recent"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recent_patients.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
            <EmptyState
              title="No recent patients"
              description="You have not seen any patients recently. Once you start seeing patients, they will appear here for quick access."
              icon={Users}
            />
          ) : (
            // </p>
            <ul className="space-y-2">
              {recent_patients.slice(0, 5).map((p) => (
                <li
                  key={`${p.national_id}-${p.study_id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 -mx-2 border-b border-border transition-colors last:border-0 hover:bg-accent/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.study_type} ·{" "}
                      {formatReportStatusLabel(p.report_status)}
                    </p>
                  </div>
                  <Link href={`/doctor/patients/profile/${p.national_id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Profile
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Follow-up Reminders */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Follow-up Reminders
            </h2>
            {/* center */}
            <Link
              href="/doctor/follow-ups"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Center
            </Link>
          </div>
          {upcoming_followups.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
            <EmptyState
              title="No upcoming follow-ups"
              description="You have no follow-up reminders scheduled. Once you set up follow-ups, they will appear here."
              icon={Clock}
            />
          ) : (
            // </p>
            <ul className="space-y-2">
              {upcoming_followups.map((f) => (
                <li
                  key={f.reminder_id}
                  className="rounded-lg px-2 py-2.5 -mx-2 border-b border-border transition-colors last:border-0 hover:bg-accent/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {f.first_name} {f.last_name}
                    </p>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                      in {f.days_remaining}d
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <BarChart
        title="Recent Activity"
        subtitle="Today's images, grouped by type"
        data={scheduleActivity}
        color="bg-emerald-800"
        className="rounded-2xl shadow-sm"
      />
    </DoctorPageShell>
  );
}
