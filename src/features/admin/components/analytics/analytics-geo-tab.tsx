"use client";

// Geo Logins tab of the analytics page.

import { useMemo } from "react";
import { Globe, MapPin } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils/date-format";
import { AdminLoadingState, MetricCard, MetricGrid } from "../shared";
import type { useGeoLogins } from "../../hooks/use-analytics";

export function AnalyticsGeoTab({
  geoData,
  geoLoading,
}: {
  geoData: ReturnType<typeof useGeoLogins>["data"];
  geoLoading: boolean;
}) {
  // top city — derived from the same geo entries already returned, no
  // extra request needed
  const topCity = useMemo(() => {
    if (!geoData?.data.data.length) return null;
    const counts = new Map<string, number>();
    for (const entry of geoData.data.data) {
      if (!entry.geo) continue;
      const key = `${entry.geo.city}, ${entry.geo.country}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let best: { label: string; count: number } | null = null;
    for (const [label, count] of counts) {
      if (!best || count > best.count) best = { label, count };
    }
    return best;
  }, [geoData]);

  if (geoLoading) return <AdminLoadingState />;
  if (!geoData?.data) return null;

  const { total, countries, data } = geoData.data;

  return (
    <div className="space-y-4">
      {/* headline KPIs */}
      <MetricGrid cols={3}>
        <MetricCard label="Total Login Events" value={total} icon={Globe} />
        <MetricCard
          label="Countries Seen"
          value={countries.length}
          icon={MapPin}
        />
        <MetricCard
          label="Top Location"
          value={topCity?.label ?? "—"}
          icon={MapPin}
          sublabel={topCity ? `${topCity.count} logins` : undefined}
        />
      </MetricGrid>

      {/* recent logins by location */}
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recent Logins
          </p>
          {data.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
              {data.length} events
            </span>
          )}
        </div>

        {data.length === 0 ? (
          <EmptyState icon={MapPin} title="No login events found" />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-900 max-h-[28rem] overflow-y-auto pr-1">
            {data.map((entry, i) => (
              <div
                key={`${entry.actor_id}-${i}`}
                className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-[image:var(--brand-gradient-soft)] shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {entry.actor_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {entry.geo
                      ? `${entry.geo.city}, ${entry.geo.country}`
                      : "Unknown location"}{" "}
                    <span className="font-mono text-gray-400">
                      · {entry.ip_address}
                    </span>
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0 tabular-nums">
                  {formatRelativeTime(entry.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
