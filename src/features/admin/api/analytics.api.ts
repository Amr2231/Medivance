import { serverFetch } from "@/lib/shared/api/server-client";
import { buildQueryParams } from "../utils/build-query-params";
import type {
  HeatmapData,
  FileAccessLogsResponse,
  GeoLoginData,
} from "@/lib/types/admin-features";

// constant url prefix
const BASE = "/api/admin/analytics";

// fetch heatmap
export async function fetchHeatmap(filters?: {
  from_date?: string;
  to_date?: string;
  actor_id?: number;
}): Promise<{ success: boolean; data: HeatmapData }> {
  return serverFetch(
    `${BASE}/heatmap${buildQueryParams({
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      actor_id: filters?.actor_id,
    })}`,
  );
}

// fetch file access
export async function fetchFileAccessLogs(filters?: {
  page?: number;
  limit?: number;
  entity?: string;
  actor_id?: number;
  from_date?: string;
  to_date?: string;
}): Promise<FileAccessLogsResponse> {
  return serverFetch<FileAccessLogsResponse>(
    `${BASE}/file-access${buildQueryParams({
      page: filters?.page,
      limit: filters?.limit,
      entity:
        filters?.entity && filters.entity !== "all"
          ? filters.entity
          : undefined,
      actor_id: filters?.actor_id,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
    })}`,
  );
}

// fetch geo logins
export async function fetchGeoLogins(filters?: {
  from_date?: string;
  to_date?: string;
}): Promise<{ success: boolean; data: GeoLoginData }> {
  return serverFetch(
    `${BASE}/geo-logins${buildQueryParams({
      from_date: filters?.from_date,
      to_date: filters?.to_date,
    })}`,
  );
}
