import type { SecurityOverview } from "@/lib/types/admin-features";


export type HealthStatus = "optimal" | "attention" | "critical";

export function computeHealthScore(overview: SecurityOverview): {
  score: number;
  status: HealthStatus;
} {
  const lockedPenalty = Math.min(30, overview.locked_accounts * 6);
  const atRiskPenalty = Math.min(25, overview.at_risk_accounts * 3);
  const failedLoginPenalty = Math.min(25, overview.failed_logins_24h * 0.5);
  const suspiciousIpPenalty = Math.min(
    20,
    overview.top_suspicious_ips.length * 5,
  );

  const score = Math.max(
    0,
    Math.round(
      100 -
        lockedPenalty -
        atRiskPenalty -
        failedLoginPenalty -
        suspiciousIpPenalty,
    ),
  );

  const status: HealthStatus =
    score >= 90 ? "optimal" : score >= 70 ? "attention" : "critical";

  return { score, status };
}

export const HEALTH_STATUS_LABEL: Record<HealthStatus, string> = {
  optimal: "Optimal state",
  attention: "Needs attention",
  critical: "Critical",
};


export function computeDayOverDayTrend(
  byDay: { day: string; count: number }[],
): { percent: number; direction: "up" | "down" | "flat" } | null {
  if (byDay.length < 2) return null;

  const today = byDay[byDay.length - 1].count;
  const yesterday = byDay[byDay.length - 2].count;

  if (yesterday === 0) {
    if (today === 0) return { percent: 0, direction: "flat" };
    return { percent: 100, direction: "up" };
  }

  const percent = Math.round(((today - yesterday) / yesterday) * 100);
  if (percent === 0) return { percent: 0, direction: "flat" };
  return { percent: Math.abs(percent), direction: percent > 0 ? "up" : "down" };
}
