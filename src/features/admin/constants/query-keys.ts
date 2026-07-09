export const adminKeys = {
  users: (filters?: Record<string, unknown>) =>
    ["admin", "users", filters ?? {}] as const,
  inactiveUsers: (filters?: Record<string, unknown>) =>
    ["admin", "inactive-users", filters ?? {}] as const,
  deactivatedPatients: (filters?: Record<string, unknown>) =>
    ["admin", "deactivated-patients", filters ?? {}] as const,
  auditLogs: (filters?: Record<string, unknown>) =>
    ["admin", "audit-logs", filters ?? {}] as const,
  sessions: (filters?: Record<string, unknown>) =>
    ["admin", "sessions", filters ?? {}] as const,
  sessionStats: ["admin", "session-stats"] as const,
  securityOverview: ["admin", "security-overview"] as const,
  lockedAccounts: ["admin", "locked-accounts"] as const,
  failedLogins: (filters?: Record<string, unknown>) =>
    ["admin", "failed-logins", filters ?? {}] as const,
  dashboard: ["admin", "dashboard"] as const,
  heatmap: (filters?: Record<string, unknown>) =>
    ["admin", "heatmap", filters ?? {}] as const,
  fileAccess: (filters?: Record<string, unknown>) =>
    ["admin", "file-access", filters ?? {}] as const,
  geoLogins: (filters?: Record<string, unknown>) =>
    ["admin", "geo-logins", filters ?? {}] as const,
};
