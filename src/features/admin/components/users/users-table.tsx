"use client";
import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "../../hooks/use-users";
import { useDeleteUser } from "../../hooks/use-delete-user";
import { useUpdateUser } from "../../hooks/use-update-user";
import { useMoveUser } from "../../hooks/use-move-user";
import type { User } from "@/lib/types/admin";
import { useSession } from "next-auth/react";
import type { EditUserPayload } from "./active-modals/edit-user-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { TABLE_HEADERS } from "@/lib/constants/users-table.constants";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { UserRow } from "./users-table-row";
import { UsersFilterBar } from "./users-table-toolbar";

// ── Lazy-load modals ──────────────────────────────────────────────────────────
const UserFiltersModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.UserFiltersModal })),
);
const UserProfilePanel = dynamic(() =>
  import("./user-profile-panel").then((m) => ({ default: m.UserProfilePanel })),
);
const EditUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.EditUserModal })),
);
const DeactivateUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.DeactivateUserModal })),
);
const DeleteUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.DeleteUserModal })),
);
const AddUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.AddUserModal })),
);

// UsersTable
type UsersTableProps = {
  // Controlled from UserManagementPage so the "Create User" sidebar
  // shortcut can open this modal even if the Users tab wasn't already
  // active (this component only mounts while that tab is selected).
  addUserOpen: boolean;
  onAddUserOpenChange: (open: boolean) => void;
};

export function UsersTable({
  addUserOpen,
  onAddUserOpenChange,
}: UsersTableProps) {
  // hooks
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id ?? 0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [filterRole, setFilterRole] = useState("all");
  const filterStatus = "all";
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  // modals
  const [selected, setSelected] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const activeFilters = [
    filterRole !== "all",
    filterStatus !== "all",
    sortDate !== "newest",
    !!filterDate,
  ].filter(Boolean).length;

  // hooks
  const { data: usersData, isLoading } = useUsers({
    keyword: debouncedSearch || undefined,
    role: filterRole === "all" ? undefined : filterRole,
    sort: sortDate,
    created_date: filterDate || undefined,
    page,
  });

  const users = useMemo(() => usersData?.data ?? [], [usersData?.data]);
  const visibleUsers =
    currentUserId > 0
      ? users.filter((u) => u.user_id !== currentUserId)
      : users;
  const totalPages = usersData?.pages ?? 1;

  // mutations
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deactivateUser, isPending: isDeactivating } = useMoveUser();

  const handleExport = useCallback(() => {
    if (visibleUsers.length === 0) return;
    const header = ["Name", "Email", "Role", "Status", "Joined"];
    const rows = visibleUsers.map((u) => [
      `${u.first_name} ${u.last_name}`,
      u.email,
      u.role_name,
      u.is_active === 1 ? "Active" : "Inactive",
      new Date(u.created_at).toISOString().slice(0, 10),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [visibleUsers]);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleSetFilterRole = useCallback((val: string) => {
    setFilterRole(val);
    setPage(1);
  }, []);

  const handleSetFilterDate = useCallback((val: string) => {
    setFilterDate(val);
    setPage(1);
  }, []);

  const handleSetSortDate = useCallback((val: "newest" | "oldest") => {
    setSortDate(val);
    setPage(1);
  }, []);

  const toggleOne = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) deleteUser(deleteTarget.user_id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteUser]);

  const handleSaveEdit = useCallback(
    (id: number, payload: EditUserPayload) => {
      updateUser({ id, payload });
      setEditUser(null);
    },
    [updateUser],
  );

  const handleConfirmDeactivate = useCallback(
    (newDoctorId?: number) => {
      if (!deactivateTarget) return;
      deactivateUser({ id: deactivateTarget.user_id, newDoctorId });
      setDeactivateTarget(null);
    },
    [deactivateTarget, deactivateUser],
  );

  // loading state
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
          <UsersFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            filterRole={filterRole}
            onFilterRoleChange={handleSetFilterRole}
            activeFilters={activeFilters}
            onOpenFilters={() => setFiltersOpen(true)}
            onExport={handleExport}
          />

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
              {visibleUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center text-sm py-10"
                  >
                    {/* Empty state */}
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="Create a new user to get started."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                visibleUsers.map((user) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    isSelected={selected.includes(user.user_id)}
                    onToggle={toggleOne}
                    onView={setViewUser}
                    onEdit={setEditUser}
                    onDeactivate={setDeactivateTarget}
                    onDelete={setDeleteTarget}
                    isDeactivating={isDeactivating}
                    currentUserId={currentUserId}
                  />
                ))
              )}
            </TableBody>
          </Table>

          {/* ── Footer: count + pagination, inside the same card ── */}
          {visibleUsers.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {visibleUsers.length} of{" "}
                {usersData?.total ?? visibleUsers.length} users
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

        {/* ── Modals ── */}
        {addUserOpen && (
          <AddUserModal open={addUserOpen} onOpenChange={onAddUserOpenChange} />
        )}
        {filtersOpen && (
          <UserFiltersModal
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            filterRole={filterRole}
            setFilterRole={handleSetFilterRole}
            filterDate={filterDate}
            setFilterDate={handleSetFilterDate}
            sortDate={sortDate}
            setSortDate={handleSetSortDate}
          />
        )}
        {viewUser && (
          <UserProfilePanel user={viewUser} onClose={() => setViewUser(null)} />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSaveEdit}
            isPending={isUpdating}
          />
        )}
        {deactivateTarget && (
          <DeactivateUserModal
            user={deactivateTarget}
            onClose={() => setDeactivateTarget(null)}
            onConfirm={handleConfirmDeactivate}
            isPending={isDeactivating}
          />
        )}
        {deleteTarget && (
          <DeleteUserModal
            user={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            isPending={isDeleting}
          />
        )}
      </div>
    </>
  );
}
