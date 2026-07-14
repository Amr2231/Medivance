"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileText,
  Info,
  PieChart,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  formatReportStatusLabel,
  normalizeReportStatus,
} from "../../utils/report-status";
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
} from "../shared/ui";
import {
  useDoctorDashboard,
  useDoctorPerformance,
} from "../../hooks/use-dashboard";
import { EmptyState } from "@/components/ui/empty-state";

const PERIODS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const REPORT_STATUS_STYLES: Record<string, string> = {
  signed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  written:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  "not written": "bg-muted text-muted-foreground border-border",
};

function AnalyticsMetricCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down"; pct: number } | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--brand-gradient-soft)]">
          <Icon className="size-4 text-emerald-700 dark:text-emerald-300" />
        </div>
      </div>
      <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      {trend ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            trend.direction === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {trend.direction === "up" ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {trend.pct}% vs last month
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground/60">&nbsp;</p>
      )}
    </div>
  );
}

function MonthlyTrendChart({
  data,
}: {
  data: { yr: number; mo: number; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Once you complete images, monthly volume will appear here."
        icon={TrendingUp}
      />
    );
  }

  // empty plot with a single floating dot.
  if (data.length === 1) {
    const only = data[0];
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 py-10 text-center">
        <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
          {only.count}
        </span>
        <span className="text-sm text-muted-foreground">
          images in {MONTH_SHORT[only.mo - 1] ?? only.mo} {only.yr}
        </span>
        <span className="mt-1 text-xs text-muted-foreground/70">
          The trend line will appear once more months of history are available.
        </span>
      </div>
    );
  }

  const width = 640;
  const height = 200;
  const padX = 20;
  const padY = 16;
  const max = Math.max(...data.map((d) => d.count), 1);
  const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: height - padY - (d.count / max) * (height - padY * 2),
    d,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${height - padY} L${points[0].x.toFixed(1)},${height - padY} Z`
      : "";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-48 w-full sm:h-56"
      >
        <defs>
          <linearGradient id="monthlyTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#monthlyTrendFill)" />}
        <path
          d={linePath}
          fill="none"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            className="fill-card"
            stroke="#059669"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-0.5">
        {data.map((d, i) => (
          <span key={i} className="font-mono text-[10px] text-muted-foreground">
            {MONTH_SHORT[d.mo - 1] ?? d.mo}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A labeled percentage bar — used for the real, available quality rates
 * (completion / on-time / follow-up). */
function RateBar({
  label,
  value,
  color = "bg-emerald-600",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
          {clamped}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/** Real diagnosis-mix donut, built from `diagnosis_distribution` counts —
 * no age/severity buckets are shown because the API doesn't provide them. */
function DiagnosisDonut({
  entries,
}: {
  entries: { label: string; value: number; color: string }[];
}) {
  const total = entries.reduce((sum, e) => sum + e.value, 0);

  if (total === 0) {
    return (
      <EmptyState
        title="No diagnoses recorded yet"
        description="Once images are diagnosed this period, the breakdown will appear here."
        icon={PieChart}
      />
    );
  }

  const nonEmptyEntries = entries.filter((entry) => entry.value > 0);
  const stops = nonEmptyEntries
    .map((entry, index) => {
      const precedingTotal = nonEmptyEntries
        .slice(0, index)
        .reduce((sum, preceding) => sum + preceding.value, 0);
      const start = (precedingTotal / total) * 360;
      const end = ((precedingTotal + entry.value) / total) * 360;
      return `${entry.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative size-28 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-card">
          <span className="font-mono text-lg font-bold tabular-nums text-foreground">
            {total}
          </span>
          <span className="text-[10px] text-muted-foreground">cases</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {entries.map((e) => (
          <li
            key={e.label}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ background: e.color }}
              />
              {e.label}
            </span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {Math.round((e.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// main component
export function DoctorAnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const perf = useDoctorPerformance(period);
  const dash = useDoctorDashboard();

  const performanceData = perf.data;
  const isLoading = perf.isLoading || dash.isLoading;
  const isError = perf.isError || dash.isError || !performanceData;

  if (isLoading) return <DoctorLoadingState />;
  if (isError) {
    return (
      <DoctorPageShell
        title="Clinical Performance Analytics"
        description="General overview of your clinical metrics and efficiency"
      >
        <DoctorErrorState
          onRetry={() => {
            perf.refetch();
            dash.refetch();
          }}
        />
      </DoctorPageShell>
    );
  }

  const { performance, monthly_activity, diagnosis_distribution } = performanceData;
  const recentPatients = dash.data?.recent_patients ?? [];

  const sortedActivity = [...monthly_activity].sort(
    (a, b) => a.yr - b.yr || a.mo - b.mo,
  );

  // Real month-over-month delta on study volume, only shown when computable.
  let studiesTrend: { direction: "up" | "down"; pct: number } | null = null;
  if (sortedActivity.length >= 2) {
    const prev = sortedActivity[sortedActivity.length - 2].count;
    const curr = sortedActivity[sortedActivity.length - 1].count;
    if (prev > 0) {
      const pct = Math.round(((curr - prev) / prev) * 100);
      studiesTrend = {
        direction: pct >= 0 ? "up" : "down",
        pct: Math.abs(pct),
      };
    }
  }

  const qualityMetrics = [
    { label: "Completion Rate", value: performance.completion_rate },
    { label: "On-Time Rate", value: performance.on_time_rate },
    { label: "Follow-up Rate", value: performance.followup_rate },
  ];
  const weakest = qualityMetrics.reduce(
    (min, m) => (m.value < min.value ? m : min),
    qualityMetrics[0],
  );

  const distEntries = [
    {
      label: "HFrEF only",
      value: Number(diagnosis_distribution.hfref_only),
      color: "#dc2626",
    },
    {
      label: "LVH only",
      value: Number(diagnosis_distribution.lvh_only),
      color: "#f97316",
    },
    {
      label: "Both",
      value: Number(diagnosis_distribution.both_conditions),
      color: "#9333ea",
    },
    {
      label: "Normal",
      value: Number(diagnosis_distribution.normal),
      color: "#10b981",
    },
    {
      label: "Borderline",
      value: Number(diagnosis_distribution.borderline),
      color: "#f59e0b",
    },
  ];

  // Exports exactly what's on screen — the currently-loaded real data,
  // nothing fabricated for the file.
  function handleExport() {
    const rows: (string | number)[][] = [
      ["Metric", "Value"],
      ["Period", perf.data!.period],
      ["Images Completed", performance.studies_completed],
      ["Reports Signed", performance.reports_signed],
      ["Completion Rate %", performance.completion_rate],
      ["On-Time Rate %", performance.on_time_rate],
      ["Follow-up Rate %", performance.followup_rate],
      [],
      ["Month", "Images"],
      ...sortedActivity.map((m) => [
        `${MONTH_SHORT[m.mo - 1] ?? m.mo} ${m.yr}`,
        m.count,
      ]),
      [],
      ["Diagnosis", "Count"],
      ...distEntries.map((e) => [e.label, e.value]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinical-analytics-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DoctorPageShell
      title="Clinical Performance Analytics"
      description="General overview of your clinical metrics and efficiency"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download />
            Export
          </Button>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* headline metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          icon={FileText}
          label="Images Completed"
          value={performance.studies_completed}
          trend={studiesTrend}
        />
        <AnalyticsMetricCard
          icon={CheckCircle2}
          label="Reports Signed"
          value={performance.reports_signed}
        />
        <AnalyticsMetricCard
          icon={Activity}
          label="Completion Rate"
          value={`${performance.completion_rate}%`}
        />
        <AnalyticsMetricCard
          icon={Activity}
          label="Follow-up Rate"
          value={`${performance.followup_rate}%`}
        />
      </div>

      {/* trend chart + care quality */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="mb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp className="size-4 text-muted-foreground" />
              Monthly Image Volume
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Images completed per month
            </p>
          </div>
          <MonthlyTrendChart data={sortedActivity} />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Activity className="size-4 text-muted-foreground" />
            Care Quality
          </h2>
          <div className="space-y-4">
            <RateBar
              label="Follow-up Rate"
              value={performance.followup_rate}
            />
            <RateBar
              label="Completion Rate"
              value={performance.completion_rate}
              color="bg-sky-600"
            />
            <RateBar
              label="On-Time Rate"
              value={performance.on_time_rate}
              color="bg-violet-600"
            />
            <RateBar
              label="Follow-up Rate"
              value={performance.followup_rate}
              color="bg-amber-500"
            />
          </div>
          <div className="mt-4 flex gap-2 rounded-xl border border-border bg-background/60 p-3">
            <Info className="size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {weakest.label}
              </span>{" "}
              is your lowest rate this period, at{" "}
              <span className="font-semibold text-foreground">
                {weakest.value}%
              </span>
              .
            </p>
          </div>
        </section>
      </div>

      {/* Recent cases */}
      <div className="grid grid-cols-1 gap-4">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Recent Cases
          </h2>
          {recentPatients.length === 0 ? (
            <EmptyState
              title="No recent cases"
              description="Once you complete images, they will show up here."
              icon={FileText}
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-semibold">Case</th>
                  <th className="pb-2 font-semibold">Patient</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 pl-2 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.slice(0, 6).map((p) => {
                  const status = normalizeReportStatus(p.report_status);
                  return (
                    <tr
                      key={`${p.national_id}-${p.study_id}`}
                      className="border-b border-border last:border-0 hover:bg-accent/50"
                    >
                      <td className="py-2.5 pr-2 font-mono text-xs text-muted-foreground">
                        #{p.study_id}
                      </td>
                      <td className="py-2.5 pr-2 text-sm font-medium text-foreground">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="py-2.5 pr-2 text-xs text-muted-foreground">
                        {p.study_type}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                            REPORT_STATUS_STYLES[status],
                          )}
                        >
                          {formatReportStatusLabel(p.report_status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </DoctorPageShell>
  );
}
