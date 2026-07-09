"use server";

import * as auditLogsApi from "../api/audit-logs.api";
import type { AuditLogsQuery } from "@/lib/types/audit-logs";

// get audit logs
export async function getAuditLogsAction(filters?: AuditLogsQuery) {
  return auditLogsApi.fetchAuditLogs(filters);
}
