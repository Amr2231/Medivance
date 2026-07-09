"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "../constants/query-keys";
import { getAuditLogsAction } from "../actions/audit-logs.actions";
import type { AuditLogsQuery } from "@/lib/types/audit-logs";

// types
export type AuditLogsFilters = AuditLogsQuery;

// use audit logs
export function useAuditLogs(filters?: AuditLogsFilters) {
  return useQuery({
    queryKey: adminKeys.auditLogs({
      keyword: filters?.keyword,
      action: filters?.action,
      entity: filters?.entity,
      actor_id: filters?.actor_id,
      entity_id: filters?.entity_id,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      sort: filters?.sort,
      order: filters?.order,
      page: filters?.page,
      limit: filters?.limit,
    }),
    queryFn: () => getAuditLogsAction(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
