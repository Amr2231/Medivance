import { serverFetch } from "@/lib/shared/api/server-client";
import { buildQueryParams } from "../utils/build-query-params";
import type {
  SecurityOverview,
  LockedAccount,
  FailedLoginLogsResponse,
} from "@/lib/types/admin-features";
import type { MutationResponse } from "@/lib/types/admin";

// constant url prefix
const BASE = "/api/admin/security";

// security overview api
export async function fetchSecurityOverview(): Promise<{
  success: boolean;
  data: SecurityOverview;
}> {
  return serverFetch(`${BASE}/overview`);
}

// locked accounts api
export async function fetchLockedAccounts(): Promise<{
  success: boolean;
  total: number;
  data: LockedAccount[];
}> {
  return serverFetch(`${BASE}/locked-accounts`);
}

// failed login logs
export async function fetchFailedLoginLogs(filters?: {
  page?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  ip?: string;
}): Promise<FailedLoginLogsResponse> {
  // make request
  return serverFetch<FailedLoginLogsResponse>(
    `${BASE}/failed-logins${buildQueryParams({
      page: filters?.page,
      limit: filters?.limit,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      ip: filters?.ip,
    })}`,
  );
}

// unlock account
export async function unlockAccount(userId: number): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`${BASE}/unlock/${userId}`, {
    method: "PATCH",
  });
}
