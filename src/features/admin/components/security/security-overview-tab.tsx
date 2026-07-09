import {
  Activity,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type {
  FailedLoginLog,
  SecurityOverview,
} from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  AdminLoadingState,
  BarChart,
  MetricCard,
  MetricGrid,
  SeverityBadge,
} from "../shared";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  HEALTH_STATUS_LABEL,
  computeDayOverDayTrend,
  computeHealthScore,
} from "../../utils/security-metrics";

type Props = {
  overview?: SecurityOverview;
  isLoading: boolean;
  logs: FailedLoginLog[];
  logsLoading: boolean;
  onShowLocked: () => void;
  onShowLogs: () => void;
};

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {children}
    </div>
  );
}

export function SecurityOverviewTab({
  overview,
  isLoading,
  logs,
  logsLoading,
  onShowLocked,
  onShowLogs,
}: Props) {
  if (isLoading) return <AdminLoadingState />;
  if (!overview) return null;
  const health = computeHealthScore(overview);
  const trend = computeDayOverDayTrend(overview.failed_logins_by_day);
  const suspiciousIps = new Set(
    overview.top_suspicious_ips.map((ip) => ip.ip_address),
  );
  const recommendations = [
    overview.locked_accounts > 0 && {
      title: `Review ${overview.locked_accounts} locked account${overview.locked_accounts > 1 ? "s" : ""}`,
      detail:
        "These accounts were auto-locked after repeated failed login attempts.",
      action: onShowLocked,
      label: "Review Accounts",
      danger: true,
    },
    overview.at_risk_accounts > 0 && {
      title: `${overview.at_risk_accounts} account${overview.at_risk_accounts > 1 ? "s" : ""} approaching lockout`,
      detail: "Recent failed attempts are close to the lockout threshold.",
      action: onShowLocked,
      label: "View Locked Accounts",
      danger: false,
    },
    overview.top_suspicious_ips.length > 0 && {
      title: `${overview.top_suspicious_ips.length} suspicious IP${overview.top_suspicious_ips.length > 1 ? "s" : ""} active`,
      detail: `Highest volume: ${overview.top_suspicious_ips[0].ip_address} with ${overview.top_suspicious_ips[0].attempts} attempts in 24h.`,
      action: onShowLogs,
      label: "Investigate Logs",
      danger: false,
    },
  ].filter(Boolean) as {
    title: string;
    detail: string;
    action: () => void;
    label: string;
    danger: boolean;
  }[];

  return (
    <div className="space-y-6">
      <MetricGrid cols={4}>
        <MetricCard
          label="Security Health Score"
          value={`${health.score}/100`}
          icon={ShieldCheck}
          danger={health.status === "critical"}
          sublabel={HEALTH_STATUS_LABEL[health.status]}
        />
        <MetricCard
          label="Failed Logins (24h)"
          value={overview.failed_logins_24h}
          icon={TrendingUp}
          danger={overview.failed_logins_24h > 10}
          sublabel={
            trend
              ? `${trend.direction === "up" ? "+" : "-"}${trend.percent}% vs yesterday`
              : undefined
          }
        />
        <MetricCard
          label="Suspicious IPs (24h)"
          value={overview.top_suspicious_ips.length}
          icon={ShieldAlert}
          danger={overview.top_suspicious_ips.length > 0}
          sublabel={
            overview.top_suspicious_ips.length
              ? "Currently flagged"
              : "None flagged"
          }
        />
        <MetricCard
          label="At Risk Accounts"
          value={overview.at_risk_accounts}
          icon={LockKeyhole}
          danger={overview.at_risk_accounts > 0}
        />
      </MetricGrid>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Activity className="h-4 w-4 text-gray-400" />
              Live Security Events
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={onShowLogs}
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          {logsLoading ? (
            <AdminLoadingState />
          ) : !logs.length ? (
            <EmptyState
              icon={ShieldCheck}
              title="No recent events"
              description="No failed login activity has been recorded."
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.slice(0, 6).map((log, index) => (
                <div
                  key={`${log.audit_log_id}-${index}`}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-gray-800 dark:text-gray-200">
                      {log.description ?? log.action}
                    </p>
                    <p className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
                      {log.actor_name && <span>{log.actor_name}</span>}
                      {log.ip_address && (
                        <span className="font-mono">{log.ip_address}</span>
                      )}
                      <span>{formatFullTimestamp(log.created_at)}</span>
                    </p>
                  </div>
                  <SeverityBadge
                    severity={
                      log.ip_address && suspiciousIps.has(log.ip_address)
                        ? "high"
                        : "medium"
                    }
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recommendations
          </p>
          {recommendations.length ? (
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-lg border p-3",
                    item.danger
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20",
                  )}
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.detail}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 bg-white text-xs dark:bg-gray-950"
                    onClick={item.action}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/20">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                No active security concerns â€” locked accounts, at-risk
                accounts and suspicious IPs are all currently at zero.
              </p>
            </div>
          )}
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          title="Failed Logins — Last 7 Days"
          data={overview.failed_logins_by_day.map((day) => ({
            label: day.day.slice(5),
            value: day.count,
          }))}
          color="bg-red-400 dark:bg-red-600"
        />
        <Panel>
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Top Suspicious IPs — Last 24h
          </p>
          {overview.top_suspicious_ips.map((ip) => (
            <div
              key={ip.ip_address}
              className="flex justify-between border-b border-gray-100 py-1.5 last:border-0 dark:border-gray-800"
            >
              <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {ip.ip_address}
              </span>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {ip.attempts} attempts
              </span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
