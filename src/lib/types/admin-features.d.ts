// ─── SESSION MANAGEMENT ───────────────────────────────────────────────────────

export type ActiveSession = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role_name: string;
  session_expires_at: string;
  last_login_at: string | null;
  last_login_ip: string | null;
};

export type SessionStatsData = {
  active_sessions: number;
  expired_sessions: number;
  by_role: { role_name: string; count: number }[];
};

export type SessionsListResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: ActiveSession[];
};

export type SessionStatsResponse = {
  success: boolean;
  data: SessionStatsData;
};

// ─── SECURITY CENTER ──────────────────────────────────────────────────────────

export type LockedAccount = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  failed_login_attempts: number;
  lockout_until: string;
  last_login_ip: string | null;
};

export type SecurityOverview = {
  locked_accounts: number;
  at_risk_accounts: number;
  failed_logins_24h: number;
  failed_logins_by_day: { day: string; count: number }[];
  top_suspicious_ips: { ip_address: string; attempts: number }[];
};

export type FailedLoginLog = {
  audit_log_id: number;
  actor_id: number | null;
  actor_name: string | null;
  actor_role: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  description: string | null;
  ip_address: string | null;
  created_at: string;
};

export type FailedLoginLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: FailedLoginLog[];
};


// ─── LIVE DASHBOARD ───────────────────────────────────────────────────────────

export type DashboardData = {
  generated_at: string;
  users: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    online_now: number;
    locked_accounts: number;
    by_role: { role_name: string; count: number }[];
    new_today: number;
  };
  patients: {
    total_patients: number;
    active_patients: number;
    deactivated_patients: number;
    new_today: number;
  };
  studies: {
    total_studies: number;
    scheduled: number;
    in_progress: number;
    completed: number;
    today: number;
    last_7_days: { day: string; count: number }[];
  };
  reports: {
    total_reports: number;
    written: number;
    signed: number;
    today: number;
  };
  notifications: {
    total: number;
    unread: number;
  };
  activity: {
    audit_logs_today: number;
    failed_logins_24h: number;
  };
};

export type DashboardResponse = {
  success: boolean;
  data: DashboardData;
};

// ─── DATA ACCESS HEATMAP ──────────────────────────────────────────────────────

export type HeatmapData = {
  matrix: { hour_of_day: number; day_of_week: number; count: number }[];
  top_actors: {
    actor_id: number;
    actor_name: string;
    actor_role: string;
    total_actions: number;
  }[];
  action_breakdown: { action: string; count: number }[];
};

// ─── FILE ACCESS MONITORING ───────────────────────────────────────────────────

export type FileAccessLog = {
  audit_log_id: number;
  actor_id: number | null;
  actor_name: string | null;
  actor_role: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  description: string | null;
  ip_address: string | null;
  created_at: string;
};

export type FileAccessLogsResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: FileAccessLog[];
};

// ─── GEO LOGIN TRACKING ───────────────────────────────────────────────────────

export type GeoEntry = {
  actor_id: number;
  actor_name: string;
  actor_role: string;
  action: string;
  ip_address: string;
  created_at: string;
  geo: {
    country: string;
    region: string;
    city: string;
    timezone: string;
    ll: [number, number];
  } | null;
};

export type GeoLoginData = {
  total: number;
  countries: { code: string; count: number }[];
  data: GeoEntry[];
};
