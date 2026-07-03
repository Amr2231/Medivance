"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationKeys } from "../constants/query-keys";
import {
  deleteNotificationAction,
  getNotificationPreviewAction,
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "../actions/notifications.actions";
import type { Notification } from "@/lib/types/notifications";

const PREVIEW_REFETCH_MS = 30_000;
const LIST_REFETCH_MS = 60_000;

export function useNotificationsPreview() {
  return useQuery({
    queryKey: notificationKeys.preview(),
    queryFn: getNotificationPreviewAction,
    staleTime: 30_000,
    refetchInterval: PREVIEW_REFETCH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useNotificationsInfinite(limit = 20) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list({ limit }),
    queryFn: ({ pageParam }) =>
      getNotificationsAction({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
    refetchInterval: LIST_REFETCH_MS,
    refetchOnWindowFocus: true,
  });
}

function invalidateNotifications(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationReadAction(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousPreview = queryClient.getQueryData<{
        unread: number;
        notifications: Notification[];
      }>(notificationKeys.preview());

      if (previousPreview) {
        queryClient.setQueryData(notificationKeys.preview(), {
          ...previousPreview,
          unread: Math.max(0, previousPreview.unread - 1),
          notifications: previousPreview.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        });
      }

      return { previousPreview };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPreview) {
        queryClient.setQueryData(
          notificationKeys.preview(),
          context.previousPreview,
        );
      }
      toast.error("Failed to mark notification as read");
    },
    onSettled: () => invalidateNotifications(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsReadAction,
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all as read");
    },
    onSettled: () => invalidateNotifications(queryClient),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      deleteNotificationAction(notificationId),
    onSuccess: () => {
      toast.success("Notification removed");
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
    onSettled: () => invalidateNotifications(queryClient),
  });
}
