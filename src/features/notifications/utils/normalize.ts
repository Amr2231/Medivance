import type {
  Notification,
  NotificationCategory,
  NotificationRow,
} from "@/lib/types/notifications";

export function normalizeIsRead(value: NotificationRow["is_read"]): boolean {
  return value === true || value === 1;
}

export function getNotificationCategory(
  type: NotificationRow["type"],
): NotificationCategory {
  if (
    type === "patient_registered" ||
    type === "doctor_reassigned" ||
    type === "patient_deactivated" || 
    type === "patient_completed" 
  )
    return "patient";

  if (
    type === "report_signed" ||
    type === "report_downloaded" || 
    type === "image_uploaded"
  )
    return "report";

  if (
    type === "user_created" || 
    type === "user_deactivated" || 
    type === "user_reactivated" || 
    type === "profile_updated" || 
    type === "password_changed" || 
    type === "patients_transferred" || 
    type === "suspicious_ip" || 
    type === "failed_login" 
  )
    return "system";

  return "system";
}

export function normalizeNotification(row: NotificationRow): Notification {
  return {
    id: row.notification_id,
    type: row.type,
    category: getNotificationCategory(row.type),
    title: row.title,
    message: row.message,
    studyId: row.study_id,
    patientId: row.patient_id,
    isRead: normalizeIsRead(row.is_read),
    createdAt: row.created_at,
  };
}

export function normalizeNotifications(
  rows: NotificationRow[],
): Notification[] {
  return rows.map(normalizeNotification);
}
