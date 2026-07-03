"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { staggerContainer, activeIndicatorTransition } from "@/lib/motion/variants";
import type { Role } from "@/lib/types/admin";
import type { Notification } from "@/lib/types/notifications";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsInfinite,
} from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { NotificationCardSkeleton } from "./notifications-skeleton";

type FilterTab = "all" | "unread" | "read";

type NotificationsPageContentProps = {
  role: Role;
};

function filterNotifications(
  notifications: Notification[],
  tab: FilterTab,
): Notification[] {
  if (tab === "unread") return notifications.filter((n) => !n.isRead);
  if (tab === "read") return notifications.filter((n) => n.isRead);
  return notifications;
}

export function NotificationsPageContent({ role }: NotificationsPageContentProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsInfinite(20);

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const allNotifications = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  const unreadCount = data?.pages[0]?.unread ?? 0;
  const filtered = filterNotifications(allNotifications, activeTab);

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: allNotifications.length || undefined },
    { id: "unread", label: "Unread", count: unreadCount || undefined },
    {
      id: "read",
      label: "Read",
      count:
        allNotifications.length > 0
          ? allNotifications.length - unreadCount
          : undefined,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-8 text-center">
        <p className="text-sm font-medium text-red-700 dark:text-red-400">
          Failed to load notifications
        </p>
        <p className="text-xs text-red-500 mt-1">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 @container">
      {/* @container + @sm: (not sm:) below — this card can sit in a narrow
       * ~360px sidebar column, and a viewport-based `sm:` breakpoint would
       * switch to a row layout there and crush the tabs into the button.
       * Sizing off the column's own width keeps them stacked until there's
       * actually room. */}
      <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-3">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800 @sm:border-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors -mb-px @sm:mb-0 @sm:rounded-lg",
                activeTab === tab.id
                  ? "text-emerald-600 @sm:bg-emerald-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
              )}
            >
              {tab.label}
              {tab.count != null && tab.count > 0 && (
                <span className="ml-1.5 text-xs tabular-nums opacity-70">
                  ({tab.count})
                </span>
              )}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="notif-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald-600 @sm:hidden"
                  transition={activeIndicatorTransition}
                />
              )}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
            className="h-8 gap-2 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-600/5 shrink-0 self-start @sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            activeTab === "unread"
              ? "No unread notifications"
              : activeTab === "read"
                ? "No read notifications"
                : "No notifications yet"
          }
          description={
            activeTab === "all"
              ? "Updates about patients and reports will appear here."
              : "You're all caught up in this view."
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                role={role}
                variant="page"
                onMarkRead={(id) => markRead(id)}
                onDelete={(id) => deleteNotification(id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {hasNextPage && activeTab === "all" && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
