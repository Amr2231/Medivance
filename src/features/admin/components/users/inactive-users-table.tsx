"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import { InactiveStatusBadge } from "./status-badge";
import {
  InactiveFiltersModal,
  TransferModal,
  ReactivateModal,
  DeleteInactiveModal,
} from "./inactive-modals";
import { useInactiveUsers } from "../../hooks/use-inactive-users";
import { useMoveUser } from "../../hooks/use-move-user";
import { useReactivateUser } from "../../hooks/use-reactivate-user";
import { useDeleteUser } from "../../hooks/use-delete-user";
import type { InactiveUser } from "@/lib/types/admin";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { TABLE_HEADERS } from "@/lib/constants/users-table.constants";
import PaginationWrapper from "@/components/ui/paginationWrapper";

// avatar background/text per role — mirrors the active users table so both
// tabs share the same visual language
const ROLE_AVATAR_STYLES: Record<string, string> = {
  Doctor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Admin:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Receptionist: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
};

// component
export function InactiveUsersTable() {
  // states
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined);

  const [transferTarget, setTransferTarget] = useState<InactiveUser | null>(
    null,
  );
  const [reactivateTarget, setReactivateTarget] = useState<InactiveUser | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<InactiveUser | null>(null);

  // filters
  const activeFilters = [
    filterRole !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  // hooks
  const { data: inactiveData, isLoading } = useInactiveUsers({
    keyword: debouncedSearch || undefined,
    page,
    role: filterRole === "all" ? undefined : filterRole,
    sort: sortDate,
    created_date: filterDate,
  });

  // computed values
  const users = inactiveData?.data ?? [];
  const totalPages = inactiveData?.pages ?? 1;

  // mutations
  const { mutate: transferAndDeactivate, isPending: isTransferring } =
    useMoveUser();
  const { mutate: reactivateUser, isPending: isReactivating } =
    useReactivateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleSetFilterRole = (val: string) => {
    setFilterRole(val);
    setPage(1);
  };

  const handleSetSortDate = (val: "newest" | "oldest") => {
    setSortDate(val);
    setPage(1);
  };

  const handleTransfer = (id: number, newDoctorId: number) => {
    transferAndDeactivate({ id, newDoctorId });
  };

  // loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* ── Unified card: filter bar + table + pagination footer ── */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in duration-300">
          {/* ── Filter bar ── */}
          <div className="flex flex-wrap items-center gap-2.5 p-4 border-b border-gray-100 dark:border-gray-800">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                placeholder="Search by name or username..."
                className="pl-9 h-10 text-sm"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Filters */}
            <Button
              variant="outline"
              className={cn(
                "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200 dark:text-gray-400 dark:border-gray-700",
                activeFilters > 0 &&
                  "bg-emerald-800 text-white border-emerald-800 hover:bg-emerald-900 hover:text-white",
              )}
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-emerald-800 font-bold">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>

          {/* ── Table ── */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-800">
                {TABLE_HEADERS.map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 first-of-type:pl-4"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center text-sm py-10"
                  >
                    {/* Empty state */}
                    <EmptyState
                      icon={Users}
                      title="No inactive users found"
                      description="Try adjusting your search or filters"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const initials =
                    `${user.fName?.charAt(0) ?? ""}${user.lName?.charAt(0) ?? ""}`.toUpperCase();
                  const avatarStyle =
                    ROLE_AVATAR_STYLES[user.role] ??
                    "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400";

                  return (
                    <TableRow
                      key={user.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900 group"
                    >
                      {/* User — avatar + name */}
                      <TableCell className="pl-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                              avatarStyle,
                            )}
                          >
                            {initials || "—"}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                              {user.fName} {user.lName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              U-{String(user.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {user.role}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
                        {new Date(user.created_date).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <InactiveStatusBadge status={user.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-4">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {user.role === "Doctor" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                              onClick={() => setTransferTarget(user)}
                              disabled={isTransferring}
                              title="Transfer patients"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                            onClick={() => setReactivateTarget(user)}
                            disabled={isReactivating}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                            onClick={() => setDeleteTarget(user)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ── Footer: count + pagination, inside the same card ── */}
          {users.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {users.length} of {inactiveData?.total ?? users.length}{" "}
                inactive users
              </p>
              {totalPages > 1 && (
                <PaginationWrapper
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <InactiveFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filterRole={filterRole}
        setFilterRole={handleSetFilterRole}
        created_date={filterDate}
        setCreatedDate={setFilterDate}
        sortDate={sortDate}
        setSortDate={handleSetSortDate}
      />
      <TransferModal
        user={transferTarget}
        onClose={() => setTransferTarget(null)}
        onConfirm={handleTransfer}
        isPending={isTransferring}
      />
      <ReactivateModal
        user={reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={(id) => reactivateUser(id)}
        isPending={isReactivating}
      />
      <DeleteInactiveModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => deleteUser(id)}
        isPending={isDeleting}
      />
    </>
  );
}
