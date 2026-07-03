"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { staggerItem } from "@/lib/motion/variants";
import type { Role } from "@/lib/types/admin";
import type { Notification } from "@/lib/types/notifications";
import { NotificationIcon } from "./notification-icon";
import { formatNotificationTime } from "../utils/format";
import { getNotificationHref } from "../utils/navigation";

type NotificationItemProps = {
  notification: Notification;
  role: Role;
  variant?: "dropdown" | "page";
  onMarkRead?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export function NotificationItem({
  notification,
  role,
  variant = "dropdown",
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const router = useRouter();
  const href = getNotificationHref(notification, role);

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
    if (href) {
      router.push(href);
    }
  };

  if (variant === "page") {
    return (
      <motion.div
        layout
        variants={staggerItem}
        exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
        whileHover={{ x: 2 }}
        className={cn(
          "flex items-start gap-4 p-4 rounded-xl border transition-[background-color,box-shadow]",
          notification.isRead
            ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:shadow-glow-sm"
            : "border-emerald-600/20 bg-emerald-600/5 hover:shadow-glow-sm",
        )}
      >
        <NotificationIcon category={notification.category} />
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "flex-1 min-w-0 text-left",
            href && "cursor-pointer hover:opacity-80",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm text-gray-900 dark:text-gray-100",
                !notification.isRead && "font-semibold",
              )}
            >
              {notification.title}
            </p>
            <span className="text-xs text-gray-400 shrink-0 tabular-nums">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {notification.message}
          </p>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          {!notification.isRead && onMarkRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-emerald-600 hover:bg-emerald-600/10"
              onClick={() => onMarkRead(notification.id)}
              title="Mark as read"
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500"
              onClick={() => onDelete(notification.id)}
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50",
        !notification.isRead && "bg-emerald-600/5 dark:bg-emerald-600/10",
        href && "cursor-pointer",
      )}
    >
      <NotificationIcon category={notification.category} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium text-gray-900 dark:text-gray-100 truncate",
              !notification.isRead && "font-semibold",
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-600" />
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1 tabular-nums">
          {formatNotificationTime(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
