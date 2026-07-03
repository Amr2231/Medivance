import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  NotificationMutationResponse,
  NotificationsListResponse,
  NotificationsQuery,
} from "@/lib/types/notifications";


function buildQueryParams(query?: NotificationsQuery): string {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchNotifications(
  query?: NotificationsQuery,
): Promise<NotificationsListResponse> {
  return serverFetch<NotificationsListResponse>(
    `/notifications${buildQueryParams(query)}`,
  );
}

export async function markNotificationRead(
  notificationId: number,
): Promise<NotificationMutationResponse> {
  return serverFetch<NotificationMutationResponse>(
    `/notifications/${notificationId}/read`,
    { method: "PATCH" },
  );
}

export async function markAllNotificationsRead(): Promise<NotificationMutationResponse> {
  return serverFetch<NotificationMutationResponse>(
    "/notifications/read-all",
    { method: "PATCH" },
  );
}

export async function deleteNotification(
  notificationId: number,
): Promise<NotificationMutationResponse> {
  return serverFetch<NotificationMutationResponse>(
    `/notifications/${notificationId}`,
    { method: "DELETE" },
  );
}
