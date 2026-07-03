"use server";

import * as notificationsApi from "../api/notifications.api";
import type {
  NotificationMutationResponse,
  NotificationsQuery,
} from "@/lib/types/notifications";
import {
  normalizeNotification,
  normalizeNotifications,
} from "../utils/normalize";

export async function getNotificationsAction(query?: NotificationsQuery) {
  const response = await notificationsApi.fetchNotifications(query);
  return {
    ...response,
    data: normalizeNotifications(response.data ?? []),
  };
}

export async function getNotificationPreviewAction() {
  const response = await notificationsApi.fetchNotifications({
    page: 1,
    limit: 8,
  });
  return {
    unread: response.unread ?? 0,
    total: response.total ?? 0,
    notifications: normalizeNotifications(response.data ?? []),
  };
}

export async function markNotificationReadAction(
  notificationId: number,
): Promise<NotificationMutationResponse> {
  return notificationsApi.markNotificationRead(notificationId);
}

export async function markAllNotificationsReadAction(): Promise<NotificationMutationResponse> {
  return notificationsApi.markAllNotificationsRead();
}

export async function deleteNotificationAction(
  notificationId: number,
): Promise<NotificationMutationResponse> {
  return notificationsApi.deleteNotification(notificationId);
}

export { normalizeNotification };
