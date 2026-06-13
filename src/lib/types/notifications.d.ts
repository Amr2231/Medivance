export type BackendNotificationType =
  | "report_signed"
  | "image_uploaded"
  | "patient_registered"
  | "doctor_reassigned"
  | "chat_message"
  | "appointment_created"
  | "appointment_cancelled"
  | "appointment_approved"
  | "appointment_status";

export type NotificationCategory = "patient" | "report" | "system";

export type NotificationRow = {
  notification_id: number;
  user_id: number;
  type: BackendNotificationType | string;
  title: string;
  message: string;
  study_id: number | null;
  patient_id: string | null;
  is_read: 0 | 1 | boolean;
  created_at: string;
};

export type Notification = {
  id: number;
  type: BackendNotificationType | string;
  category: NotificationCategory;
  title: string;
  message: string;
  studyId: number | null;
  patientId: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsListResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  unread: number;
  pages: number;
  data: NotificationRow[];
};

export type NotificationMutationResponse = {
  success: boolean;
  message: string;
};

export type NotificationsQuery = {
  page?: number;
  limit?: number;
};
