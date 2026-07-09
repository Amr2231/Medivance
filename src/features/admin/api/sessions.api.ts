import { serverFetch } from "@/lib/shared/api/server-client";
import { buildQueryParams } from "../utils/build-query-params";
import type {
  SessionsListResponse,
  SessionStatsResponse,
} from "@/lib/types/admin-features";
import type { MutationResponse } from "@/lib/types/admin";

// constant url prefix
const BASE = "/api/admin/sessions";

// get active sessions
export async function fetchActiveSessions(filters?: {
  page?: number;
  keyword?: string;
  role?: string;
  limit?: number;
}): Promise<SessionsListResponse> {
  return serverFetch<SessionsListResponse>(
    `${BASE}${buildQueryParams({
      page: filters?.page,
      keyword: filters?.keyword,
      role: filters?.role && filters.role !== "all" ? filters.role : undefined,
      limit: filters?.limit,
    })}`,
  );
}

export async function fetchSessionStats(): Promise<SessionStatsResponse> {
  return serverFetch<SessionStatsResponse>(`${BASE}/stats`);
}

export async function forceLogoutUser(
  userId: number,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`${BASE}/${userId}`, {
    method: "DELETE",
  });
}

export async function forceLogoutAll(): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`${BASE}/logout-all`, {
    method: "DELETE",
  });
}
