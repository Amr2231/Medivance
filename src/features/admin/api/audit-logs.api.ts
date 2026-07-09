import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  AuditLogsListResponse,
  AuditLogsQuery,
} from "@/lib/types/audit-logs";

// fetch audit logs from server
export async function fetchAuditLogs(
  filters?: AuditLogsQuery,
): Promise<AuditLogsListResponse> {
  const params = new URLSearchParams();

  // set query params
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.sort) params.set("sort", filters.sort);
  if (filters?.order) params.set("order", filters.order);
  if (filters?.actor_id) params.set("actor_id", String(filters.actor_id));
  if (filters?.action) params.set("action", filters.action);
  if (filters?.entity) params.set("entity", filters.entity);
  if (filters?.entity_id) params.set("entity_id", filters.entity_id);
  if (filters?.from_date) params.set("from_date", filters.from_date);
  if (filters?.to_date) params.set("to_date", filters.to_date);
  if (filters?.keyword) params.set("keyword", filters.keyword);

  // make request
  const qs = params.toString();
  return serverFetch<AuditLogsListResponse>(`/audit-logs${qs ? `?${qs}` : ""}`);
}
