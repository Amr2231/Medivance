"use client";
import { useState } from "react";
import { LogOut, ScrollText, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import type { Role, User } from "@/lib/types/admin";
import { UserStatusBadge } from "./status-badge";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import { useActiveSessions, useForceLogout } from "../../hooks/use-sessions";
import { ActionBadge } from "../audit-logs/action-badge";
import { AuditSeverityBadge } from "../audit-logs/audit-severity-badge";
import { getAuditLogSeverity } from "../../constants/audit-logs.constants";
import { formatFullTimestamp } from "@/lib/utils/date-format";

const ROLE_AVATAR_STYLES: Record<Role, string> = {
  Doctor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Admin:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Receptionist: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
};

const TABS = [
  { id: "activity", label: "Recent Activity" },
  { id: "sessions", label: "Sessions" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function UserProfilePanel({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("activity");

  const { data: auditData, isLoading: isLoadingActivity } = useAuditLogs({
    actor_id: user?.user_id,
    limit: 8,
    sort: "created_at",
    order: "DESC",
  });

  const { data: sessionsData, isLoading: isLoadingSessions } =
    useActiveSessions({ keyword: user?.username, page: 1 });

  const { mutate: forceLogout, isPending: isLoggingOut } = useForceLogout();

  if (!user) return null;

  const initials =
    `${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`.toUpperCase();
  const avatarStyle =
    ROLE_AVATAR_STYLES[user.role_name] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400";

  const activity = auditData?.data ?? [];
  const sessions = (sessionsData?.data ?? []).filter(
    (s) => s.user_id === user.user_id,
  );

  return (
    <Sheet open={!!user} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="sr-only">User Profile</SheetTitle>
          <SheetDescription className="sr-only">
            Profile, recent activity, and sessions for {user.first_name}{" "}
            {user.last_name}
          </SheetDescription>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                avatarStyle,
              )}
            >
              {initials || "—"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700">
              {user.role_name}
            </span>
            <UserStatusBadge
              status={user.is_active === 1 ? "Active" : "Inactive"}
            />
          </div>
        </SheetHeader>

        {/* basic info */}
        <div className="px-5 py-4 border-b grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Username
            </p>
            <p className="font-mono text-xs text-gray-800 dark:text-gray-200">
              {user.username ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              Member since
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {new Date(user.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex border-b px-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "activity" &&
            (isLoadingActivity ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Loading activity…
              </p>
            ) : activity.length === 0 ? (
              <EmptyState
                icon={ScrollText}
                title="No activity yet"
                description="This user hasn't triggered any logged actions."
              />
            ) : (
              <ul className="space-y-3">
                {activity.map((log, i) => (
                  <li
                    key={log.audit_log_id ?? log.id ?? i}
                    className="rounded-lg border p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <ActionBadge action={log.action} />
                      <AuditSeverityBadge
                        severity={getAuditLogSeverity(log.action)}
                      />
                    </div>
                    {log.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {log.description}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 tabular-nums">
                      {formatFullTimestamp(log.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "sessions" &&
            (isLoadingSessions ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Loading sessions…
              </p>
            ) : sessions.length === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No active sessions"
                description="This user isn't currently signed in anywhere."
              />
            ) : (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li
                    key={s.user_id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {s.last_login_ip ?? "Unknown IP"}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        disabled={isLoggingOut}
                        onClick={() => forceLogout(s.user_id)}
                        title="Force logout"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {s.last_login_at && (
                      <p className="text-[11px] text-gray-400">
                        Last login: {formatFullTimestamp(s.last_login_at)}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400">
                      Expires: {formatFullTimestamp(s.session_expires_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
