export type AppointmentStatus =
  | "Scheduled"
  | "Checked In"
  | "Waiting"
  | "In Consultation"
  | "Completed"
  | "Cancelled"
  | "No Show";

export type BoardStatus =
  | "Waiting"
  | "Checked In"
  | "Called"
  | "In Consultation"
  | "Completed";

export type PriorityLevel =
  | "Emergency"
  | "VIP"
  | "Pregnant"
  | "Senior Citizen"
  | "Normal";

export type DoctorStatus =
  | "Available"
  | "Busy"
  | "In Consultation"
  | "Break"
  | "On Leave";

export type CallbackStatus = "Pending" | "Contacted" | "Closed";
export type CallbackPriority = "High" | "Normal" | "Low";

export interface Appointment {
  appointment_id: number;
  national_id: string;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  priority_level: PriorityLevel;
  check_in_at: string | null;
  consultation_started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
  patient_name: string;
  phone_number: string;
  gender: string;
  doctor_name: string;
  queue_id?: number | null;
  queue_position?: number | null;
  board_status?: BoardStatus | null;
  priority_score?: number | null;
  priority_reason?: string | null;
  estimated_wait_minutes?: number | null;
}

export interface QueueEntry {
  queue_id: number;
  appointment_id: number;
  queue_position: number;
  board_status: BoardStatus;
  priority_level: PriorityLevel;
  priority_score: number;
  priority_reason: string | null;
  estimated_wait_minutes: number | null;
  patient_name: string;
  national_id: string;
  doctor_name: string;
  doctor_id: number;
  waiting_minutes: number;
  appointment_time: string;
  check_in_at: string | null;
}

export interface ArrivalBoardEntry {
  queue_id: number;
  appointment_id: number;
  queue_position: number;
  board_status: BoardStatus;
  priority_level: PriorityLevel;
  estimated_wait_minutes: number | null;
  patient_name: string;
  national_id: string;
  doctor_name: string;
  waiting_minutes: number;
}

export interface DashboardMetrics {
  total_today: number;
  checked_in: number;
  waiting: number;
  completed: number;
  no_shows: number;
  in_consultation: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  live_queue: QueueEntry[];
  upcoming: {
    appointment_id: number;
    appointment_time: string;
    status: AppointmentStatus;
    patient_name: string;
    doctor_name: string;
  }[];
  doctors: DoctorAvailability[];
  priority_overview: { priority_level: PriorityLevel; count: number }[];
  charts: {
    appointment_trends: { day: string; total: number }[];
    check_in_activity: { hour: number; count: number }[];
    daily_operations: { status: string; count: number }[];
  };
}

export interface DoctorAvailability {
  doctor_id: number;
  doctor_name: string;
  status: DoctorStatus;
  break_until: string | null;
  workload_count: number;
  current_appointment_id: number | null;
  today_appointments?: number;
  next_available_slot?: string | null;
  updated_at?: string;
}

export interface CallbackRequest {
  callback_id: number;
  national_id: string | null;
  patient_name: string | null;
  phone_number: string;
  reason: string;
  notes: string | null;
  priority: CallbackPriority;
  status: CallbackStatus;
  created_by: number;
  created_by_name: string;
  created_at: string;
  attempt_count?: number;
}

export interface ContactAttempt {
  attempt_id: number;
  callback_id: number | null;
  national_id: string | null;
  outcome: string;
  notes: string | null;
  contacted_at: string;
  contacted_by_name: string;
}

export interface CommunicationEntry {
  communication_id: number;
  national_id: string;
  appointment_id: number | null;
  type: string;
  title: string;
  content: string | null;
  metadata: string | null;
  created_by_name: string;
  created_at: string;
}

export interface SlotSuggestion {
  appointment_time: string;
  score: number;
  reasons: string[];
  doctor_id: number;
  doctor_name: string;
  duration_minutes: number;
}

export interface SchedulingResult {
  date: string;
  doctor_id: number;
  suggestions: SlotSuggestion[];
  warnings: { type: string; message: string; time?: string }[];
  alternatives: { date: string; top_slot: SlotSuggestion }[];
}

export interface ChatInboxItem {
  user_id: number;
  name: string;
  role_name: string;
  last_message: string;
  created_at: string;
  patient_id: string | null;
  appointment_id: number | null;
  unread_count: number;
  is_online: number;
}

export interface ChatMessage {
  message_id: number;
  message: string;
  is_read: number;
  read_at: string | null;
  created_at: string;
  sender_id: number;
  sender_name: string;
  patient_id: string | null;
  appointment_id: number | null;
  attachment_path: string | null;
  patient_name?: string | null;
}

export interface PatientChatThread {
  patient_id: string;
  patient_name: string;
  appointment_id: number | null;
  message_count: number;
  last_message_at: string;
  unread_count: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
