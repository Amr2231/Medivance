/** Doctor portal types aligned with backend `/api/dashboard`, `/api/watchlist`, etc. */

export type DoctorDashboardStats = {
  patients_today: number;
  avg_consultation_min: number;
  prescriptions_month: number;
  followup_completion_pct: number;
  ai_accept_rate_pct: number;
};

export type DoctorRecentPatient = {
  national_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  study_id: number;
  study_type: string;
  study_date: string;
  study_status: string;
  report_status: string | null;
};

export type DoctorScheduleItem = {
  national_id: string;
  first_name: string;
  last_name: string;
  study_id: number;
  study_type: string;
  study_date: string;
  status: string;
};

export type DoctorFollowUpPreview = {
  reminder_id: number;
  due_date: string;
  reason: string;
  priority: string;
  days_remaining: number;
  first_name: string;
  last_name: string;
  national_id: string;
};

export type DoctorWatchlistPreview = {
  national_id: string;
  note: string;
  priority: "critical" | "monitor" | "stable" | string;
  first_name: string;
  last_name: string;
};

export type DoctorDashboardResponse = {
  success: boolean;
  stats: DoctorDashboardStats;
  recent_patients: DoctorRecentPatient[];
  today_schedule: DoctorScheduleItem[];
  upcoming_followups: DoctorFollowUpPreview[];
  watchlist: DoctorWatchlistPreview[];
};

export type WatchlistItem = {
  id: number;
  national_id: string;
  note: string;
  latest_study_note?: string | null;
  priority: string;
  created_at: string;
  first_name: string;
  last_name: string;
  study_id: number | null;
  study_type: string | null;
  study_status: string | null;
  report_status: string | null;
  ejection_fraction: number | null;
  has_hfref: number | null;
  has_lvh: number | null;
};

export type WatchlistResponse = {
  success: boolean;
  count: number;
  data: WatchlistItem[];
};

export type FollowUpReminder = {
  reminder_id: number;
  due_date: string;
  reason: string;
  priority: string;
  is_done: number;
  created_at: string;
  national_id: string;
  first_name: string;
  last_name: string;
  days_remaining: number;
};

export type FollowUpResponse = {
  success: boolean;
  count: number;
  data: FollowUpReminder[];
};

export type CreateFollowUpPayload = {
  national_id: string;
  days: number;
  reason: string;
  priority?: string;
};

export type ChatInboxItem = {
  user_id: number;
  name: string;
  role_name: string;
  last_message: string;
  created_at: string;
  unread_count: number;
};

export type ChatMessage = {
  message_id: number;
  message: string;
  is_read: number;
  created_at: string;
  sender_id: number;
  sender_name: string;
};

export type DoctorPerformanceResponse = {
  success: boolean;
  period: string;
  performance: {
    completion_rate: number;
    on_time_rate: number;
    followup_rate: number;
    ai_accept_rate: number;
    studies_completed: number;
    reports_signed: number;
  };
  monthly_activity: { yr: number; mo: number; count: number }[];
  diagnosis_distribution: {
    hfref_only: number;
    lvh_only: number;
    both_conditions: number;
    normal: number;
    borderline: number;
  };
};
