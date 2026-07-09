"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  AlertTriangle,
  Download,
  LogOut,
  Radio,
  Shield,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { ActiveSession } from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  MetricCard,
  MetricGrid,
  RoleBadge,
  TableToolbar,
  UserAvatar,
} from "../shared";
import {
  useActiveSessions,
  useForceLogout,
  useForceLogoutAll,
  useSessionStats,
} from "../../hooks/use-sessions";
import { exportRowsToCsv } from "../../utils/export-csv";
import { getSessionStatus } from "../../utils/session-status";
import { SessionDetailsPanel } from "./session-details-panel";
import PaginationWrapper from "@/components/ui/paginationWrapper";

const STATUS_DOT = {
  active: "bg-green-500",
  expiring_soon: "bg-amber-500",
  expired: "bg-gray-300",
};

const STATUS_TEXT = {
  active: "text-green-700 dark:text-green-400",
  expiring_soon: "text-amber-700 dark:text-amber-400",
  expired: "text-gray-400",
};

const STATUS_LABEL = {
  active: "Active",
  expiring_soon: "Expiring soon",
  expired: "Expired",
};

// component
export function SessionManagementPage() {
  // state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("all");
  const [targetSession, setTargetSession] = useState<ActiveSession | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);

  // hooks & queries
  const { data, isLoading, isFetching } = useActiveSessions({
    page,
    keyword: debouncedSearch || undefined,
    role: role !== "all" ? role : undefined,
  });
  const { data: statsData } = useSessionStats();
  const { mutate: forceLogout, isPending: logoutPending } = useForceLogout();
  const { mutate: logoutAll, isPending: logoutAllPending } =
    useForceLogoutAll();

  // computed values
  const stats = statsData?.data;
  const sessions = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = data?.pages ?? 1;

  // keep the desktop selection pointed at a session that's actually on the page
  const selectedSession =
    sessions.find((session) => session.user_id === selectedId) ??
    sessions[0] ??
    null;

  // handlers
  const handleForceLogout = useCallback(() => {
    if (!targetSession) return;
    forceLogout(targetSession.user_id, {
      onSuccess: () => setTargetSession(null),
    });
  }, [targetSession, forceLogout]);

  const handleLogoutAll = useCallback(() => {
    logoutAll(undefined, {
      onSuccess: () => setLogoutAllOpen(false),
    });
  }, [logoutAll]);

  const handleExport = useCallback(() => {
    exportRowsToCsv(
      `active-sessions-${new Date().toISOString().slice(0, 10)}`,
      sessions.map((s) => ({
        first_name: s.first_name,
        last_name: s.last_name,
        username: s.username,
        email: s.email,
        role: s.role_name,
        last_login_at: s.last_login_at ?? "",
        session_expires_at: s.session_expires_at,
        last_login_ip: s.last_login_ip ?? "",
        status: getSessionStatus(s.session_expires_at),
      })),
    );
  }, [sessions]);

  // loading
  if (isLoading) return <AdminLoadingState />;

  return (
    <AdminPageShell
      title="Session Management"
      description="Monitor and control active user sessions across the network"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            disabled={!sessions.length}
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => setLogoutAllOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <LogOut className="w-4 h-4" />
            Terminate All
          </Button>
        </div>
      }
    >
      {/* stats */}
      {stats && (
        <MetricGrid cols={4}>
          {/* sessions card */}
          <MetricCard
            label="Active Sessions"
            value={stats.active_sessions}
            icon={Wifi}
            accent="bg-green-100 dark:bg-green-900/40"
          />

          {/* expired sessions */}
          <MetricCard
            label="Expired Sessions"
            value={stats.expired_sessions}
            icon={Radio}
            accent="bg-amber-100 dark:bg-amber-900/40"
          />

          {/* roles  */}
          {stats.by_role.map((r) => (
            <MetricCard
              key={r.role_name}
              label={`${r.role_name}s Online`}
              value={r.count}
              icon={Shield}
            />
          ))}
        </MetricGrid>
      )}

      {/* table toolbar */}
      <TableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email or username..."
        filters={
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Receptionist">Receptionist</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* table + persistent details panel (docked, not a popup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
        <AdminTableShell isFetching={isFetching}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
                  {["User", "Role", "Last Login", "Expires", "IP", "Status", ""].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-semibold text-gray-500 first:pl-4"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* sessions */}
                {sessions.length === 0 ? (
                  <TableRow>
                    {/* empty state */}
                    <TableCell colSpan={7} className="py-10">
                      <EmptyState
                        icon={Shield}
                        title="No active sessions"
                        description="No users are currently logged in."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => {
                    const status = getSessionStatus(
                      session.session_expires_at,
                    );
                    const isSelected = session.user_id === selectedId;
                    return (
                      <TableRow
                        key={session.user_id}
                        className={cn(
                          "border-b border-gray-100 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 cursor-pointer transition-colors",
                          isSelected &&
                            "bg-emerald-50/70 hover:bg-emerald-50/70 dark:bg-emerald-950/20",
                        )}
                        onClick={() => setSelectedId(session.user_id)}
                      >
                        {/* user */}
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              firstName={session.first_name}
                              lastName={session.last_name}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {session.first_name} {session.last_name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {session.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* role */}
                        <TableCell>
                          <RoleBadge role={session.role_name} />
                        </TableCell>

                        {/* last login */}
                        <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                          {session.last_login_at
                            ? formatFullTimestamp(session.last_login_at)
                            : "—"}
                        </TableCell>

                        {/* session expires */}
                        <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                          {formatFullTimestamp(session.session_expires_at)}
                        </TableCell>

                        {/* ip */}
                        <TableCell className="font-mono text-xs text-gray-500">
                          {session.last_login_ip ?? "—"}
                        </TableCell>

                        {/* status */}
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
                              STATUS_TEXT[status],
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                STATUS_DOT[status],
                              )}
                            />
                            {STATUS_LABEL[status]}
                          </span>
                        </TableCell>

                        {/* actions */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 h-8 text-xs"
                            onClick={() => setTargetSession(session)}
                          >
                            <LogOut className="w-3 h-3" />
                            Logout
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </AdminTableShell>

        {/* pagination */}
        {totalPages > 1 && (
          <PaginationWrapper
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        </div>

        {/* persistent details panel — docked in the layout, not a popup/modal */}
        <SessionDetailsPanel
          session={selectedSession}
          onForceLogout={(s) => setTargetSession(s)}
          logoutPending={logoutPending}
        />
      </div>

      <Dialog
        open={!!targetSession}
        onOpenChange={(v) => !v && setTargetSession(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            {/* terminate session */}
            <DialogTitle>Terminate Session</DialogTitle>

            {/* description and username */}
            <DialogDescription>
              Force logout{" "}
              <span className="font-medium text-gray-800">
                {targetSession?.first_name} {targetSession?.last_name}
              </span>
              ? They will be signed out immediately.
            </DialogDescription>
          </DialogHeader>

          {/* actions */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetSession(null)}>
              Cancel
            </Button>
            <Button
              disabled={logoutPending}
              onClick={handleForceLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {logoutPending ? "Terminating..." : "Terminate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* logout all */}
      <Dialog open={logoutAllOpen} onOpenChange={setLogoutAllOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {/* icon */}
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Terminate All Sessions
            </DialogTitle>
            <DialogDescription>
              This will immediately sign out ALL users except yourself.
            </DialogDescription>
          </DialogHeader>

          {/* actions */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutAllOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={logoutAllPending}
              onClick={handleLogoutAll}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {logoutAllPending ? "Terminating..." : "Terminate All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
