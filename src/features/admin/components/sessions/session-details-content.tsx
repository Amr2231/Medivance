"use client";

import { Clock, Globe, LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import type { ActiveSession } from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  formatTimeRemaining,
  getSessionStatus,
} from "../../utils/session-status";
import { RoleBadge, UserAvatar } from "../shared";

// types
type SessionDetailsContentProps = {
  session: ActiveSession;
  onForceLogout: (session: ActiveSession) => void;
  logoutPending?: boolean;
};

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  expiring_soon: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  expired: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800",
};

const STATUS_LABEL = {
  active: "Active",
  expiring_soon: "Expiring soon",
  expired: "Expired",
};

// component
export function SessionDetailsContent({
  session,
  onForceLogout,
  logoutPending,
}: SessionDetailsContentProps) {
  const status = getSessionStatus(session.session_expires_at);

  return (
    <div className="space-y-6">
      {/* identity */}
      <div className="flex items-center gap-3">
        <UserAvatar
          firstName={session.first_name}
          lastName={session.last_name}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {session.first_name} {session.last_name}
          </p>
          <p className="text-xs text-gray-400 truncate">{session.email}</p>
        </div>
        <span
          className={cn(
            "ml-auto shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            STATUS_STYLES[status],
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      <RoleBadge role={session.role_name} />

      {/* account */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Account
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                {session.username}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Last Login IP</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                {session.last_login_ip ?? "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* session lifecycle */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Session Lifecycle
        </p>
        <div className="relative pl-4 border-l-2 border-emerald-600/30 space-y-4">
          {session.last_login_at && (
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <p className="text-xs text-gray-500">Session Started</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatFullTimestamp(session.last_login_at)}
              </p>
            </div>
          )}

          <div className="relative">
            <span
              className={cn(
                "absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full",
                status === "expired" ? "bg-gray-400" : "bg-green-500",
              )}
            />
            <p className="text-xs text-gray-500">
              {status === "expired" ? "Session ended" : "Session active"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {formatTimeRemaining(session.session_expires_at)}
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <p className="text-xs text-gray-500">Auto-Expiration</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {formatFullTimestamp(session.session_expires_at)}
            </p>
          </div>
        </div>
      </div>

      {/* connection note — only shown when we actually know the IP */}
      {session.last_login_ip && (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 px-3 py-2 text-xs text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Authenticated session tied to {session.last_login_ip}
        </div>
      )}

      {/* force logout */}
      <div>
        <Button
          variant="outline"
          disabled={logoutPending}
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2 dark:border-red-900 dark:hover:bg-red-950/30"
          onClick={() => onForceLogout(session)}
        >
          <LogOut className="w-4 h-4" />
          {logoutPending ? "Terminating..." : "Force Logout"}
        </Button>
        <p className="text-[11px] text-gray-400 mt-2 text-center">
          Instantly terminates this connection and requires re-authentication.
        </p>
      </div>

      {!session.last_login_at && (
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          No previous login recorded for this session.
        </p>
      )}
    </div>
  );
}
