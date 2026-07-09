"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Download, Pause, Play, ShieldAlert, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import type {
  FailedLoginLogsResponse,
  LockedAccount,
} from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  AdminTabs,
  RoleBadge,
  SeverityBadge,
  TableToolbar,
  UserAvatar,
} from "../shared";
import {
  useFailedLoginLogs,
  useLockedAccounts,
  useSecurityOverview,
  useUnlockAccount,
} from "../../hooks/use-security";
import { exportRowsToCsv } from "../../utils/export-csv";
import { formatTimeRemaining } from "../../utils/session-status";
import { SecurityOverviewTab } from "./security-overview-tab";

type SecurityTab = "overview" | "locked" | "logs";

function LockedAccountsTab({
  accounts,
  isLoading,
  onUnlock,
}: {
  accounts?: LockedAccount[];
  isLoading: boolean;
  onUnlock: (account: LockedAccount) => void;
}) {
  if (isLoading) return <AdminLoadingState />;
  return (
    <AdminTableShell isFetching={false}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/70">
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Failed Attempts</TableHead>
            <TableHead>Locked Until</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!accounts?.length ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10">
                <EmptyState
                  icon={ShieldAlert}
                  title="No locked accounts"
                  description="All accounts are accessible."
                />
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => {
              const remaining = formatTimeRemaining(account.lockout_until);
              return (
                <TableRow
                  key={account.user_id}
                  className="border-l-2 border-l-red-300 hover:bg-red-50/30 dark:border-l-red-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        firstName={account.first_name}
                        lastName={account.last_name}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {account.first_name} {account.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{account.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={account.role_name} />
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                      {account.failed_login_attempts}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm tabular-nums">
                      {formatFullTimestamp(account.lockout_until)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {remaining === "Expired" ? "Ready to unlock" : remaining}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {account.last_login_ip ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-xs text-emerald-700"
                      onClick={() => onUnlock(account)}
                    >
                      <Unlock className="h-3 w-3" />
                      Unlock
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </AdminTableShell>
  );
}

function FailedLoginLogsTab({
  data,
  isFetching,
  search,
  onSearchChange,
  onPageChange,
  suspiciousIps,
  onExport,
}: {
  data?: FailedLoginLogsResponse;
  isFetching: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  suspiciousIps: Set<string>;
  onExport: () => void;
}) {
  return (
    <div className="space-y-4">
      <TableToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Filter by IP address..."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!data?.data.length}
            onClick={onExport}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        }
      />
      <AdminTableShell isFetching={isFetching}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70">
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data?.data.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10">
                  <EmptyState
                    icon={ShieldAlert}
                    title="No failed login logs"
                    description="No suspicious activity found."
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((log, index) => {
                const [firstName, ...lastName] = (log.actor_name ?? "").split(
                  " ",
                );
                const suspicious =
                  !!log.ip_address && suspiciousIps.has(log.ip_address);
                return (
                  <TableRow key={`${log.audit_log_id}-${index}`}>
                    <TableCell className="text-sm tabular-nums">
                      {formatFullTimestamp(log.created_at)}
                    </TableCell>
                    <TableCell>
                      {log.actor_name ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            firstName={firstName}
                            lastName={lastName.join(" ")}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {log.actor_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {log.actor_role}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Unknown user
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {log.description ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-mono text-xs",
                        suspicious
                          ? "font-semibold text-red-600"
                          : "text-gray-500",
                      )}
                    >
                      {log.ip_address ?? "—"}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge
                        severity={suspicious ? "high" : "medium"}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </AdminTableShell>
      {(data?.pages ?? 0) > 1 && (
        <PaginationWrapper
          totalPages={data?.pages ?? 1}
          currentPage={data?.page ?? 1}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export function SecurityCenterPage() {
  const [tab, setTab] = useState<SecurityTab>("overview");
  const [targetUser, setTargetUser] = useState<LockedAccount | null>(null);
  const [logsPage, setLogsPage] = useState(1);
  const [ipSearch, setIpSearch] = useState("");
  const [debouncedIp] = useDebounce(ipSearch, 400);
  const [live, setLive] = useState(true);
  const { data: overviewData, isLoading: overviewLoading } =
    useSecurityOverview({ live });
  const { data: lockedData, isLoading: lockedLoading } = useLockedAccounts();
  const { data: logsData, isFetching: logsFetching } = useFailedLoginLogs(
    { page: logsPage, ip: debouncedIp || undefined },
    { live },
  );
  const { mutate: unlock, isPending: unlockPending } = useUnlockAccount();
  const suspiciousIps = useMemo(
    () =>
      new Set(
        overviewData?.data.top_suspicious_ips.map((ip) => ip.ip_address) ?? [],
      ),
    [overviewData],
  );
  const exportLogs = () => {
    if (logsData?.data.length)
      exportRowsToCsv(
        `security-audit-log-${new Date().toISOString().slice(0, 10)}`,
        logsData.data.map((log) => ({
          timestamp: log.created_at,
          actor: log.actor_name ?? "",
          actor_role: log.actor_role ?? "",
          action: log.action,
          description: log.description ?? "",
          ip_address: log.ip_address ?? "",
        })),
      );
  };
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    {
      id: "locked" as const,
      label: "Locked Accounts",
      count: lockedData?.total,
    },
    { id: "logs" as const, label: "Failed Logins" },
  ];
  return (
    <AdminPageShell
      title="Security Center"
      description="Live overview of platform health, active threats, and recommended actions"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setLive((value) => !value)}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                live ? "animate-pulse bg-emerald-500" : "bg-gray-300",
              )}
            />
            {live ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {live ? "Live" : "Paused"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            disabled={!logsData?.data.length}
            onClick={exportLogs}
          >
            <Download className="h-4 w-4" />
            Export Audit Log
          </Button>
        </div>
      }
    >
      <AdminTabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "overview" && (
        <SecurityOverviewTab
          overview={overviewData?.data}
          isLoading={overviewLoading}
          logs={logsData?.data ?? []}
          logsLoading={logsFetching && !logsData}
          onShowLocked={() => setTab("locked")}
          onShowLogs={() => setTab("logs")}
        />
      )}
      {tab === "locked" && (
        <LockedAccountsTab
          accounts={lockedData?.data}
          isLoading={lockedLoading}
          onUnlock={setTargetUser}
        />
      )}
      {tab === "logs" && (
        <FailedLoginLogsTab
          data={logsData}
          isFetching={logsFetching}
          search={ipSearch}
          onSearchChange={(value) => {
            setIpSearch(value);
            setLogsPage(1);
          }}
          onPageChange={setLogsPage}
          suspiciousIps={suspiciousIps}
          onExport={exportLogs}
        />
      )}
      <Dialog
        open={!!targetUser}
        onOpenChange={(open) => !open && setTargetUser(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Unlock Account</DialogTitle>
            <DialogDescription>
              Unlock{" "}
              <span className="font-medium text-gray-800">
                {targetUser?.first_name} {targetUser?.last_name}
              </span>
              ? They will be able to log in immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetUser(null)}>
              Cancel
            </Button>
            <Button
              disabled={unlockPending}
              onClick={() =>
                targetUser &&
                unlock(targetUser.user_id, {
                  onSuccess: () => setTargetUser(null),
                })
              }
            >
              {unlockPending ? "Unlocking..." : "Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
