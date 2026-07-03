"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import type { Role } from "@/lib/types/admin";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsPreview,
} from "../hooks/use-notifications";
import { getNotificationsPagePath } from "../utils/navigation";
import { NotificationItem } from "./notification-item";
import { NotificationsListSkeleton } from "./notifications-skeleton";

type NotificationBellProps = {
  role: Role;
};

export function NotificationBell({ role }: NotificationBellProps) {
  const { data, isLoading, isError } = useNotificationsPreview();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread ?? 0;
  const notificationsPath = getNotificationsPagePath(role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="size-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-0.5 items-center justify-center rounded-full bg-emerald-800 text-[10px] text-white font-medium tabular-nums shadow-glow-sm"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 overflow-hidden"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-medium tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-[#059669] hover:text-[#059669]"
              onClick={() => markAllRead()}
              disabled={isMarkingAll}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading ? (
            <NotificationsListSkeleton count={4} />
          ) : isError ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Unable to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up"
              className="py-10"
            />
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                role={role}
                variant="dropdown"
                onMarkRead={(id) => markRead(id)}
              />
            ))
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5">
          <Link
            href={notificationsPath}
            className="text-xs text-emerald-800 hover:underline w-full text-center block font-medium"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
