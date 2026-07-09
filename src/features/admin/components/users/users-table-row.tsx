"use client";
import { memo } from "react";
import { Eye, Edit, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import { UserStatusBadge } from "./status-badge";
import type { Role, User } from "@/lib/types/admin";

// avatar background/text per role — gives each row a quick visual anchor,
// same idea as the reference design's colored initial circles
const ROLE_AVATAR_STYLES: Record<Role, string> = {
  Doctor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Admin:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Receptionist: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
};

export const UserRow = memo(function UserRow({
  user,
  onView,
  onEdit,
  onDeactivate,
  onDelete,
  isDeactivating,
  currentUserId,
}: {
  user: User;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
  isDeactivating: boolean;
  currentUserId?: number;
}) {
  const initials =
    `${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`.toUpperCase();
  const avatarStyle =
    ROLE_AVATAR_STYLES[user.role_name] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400";

  return (
    <TableRow
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-50/60 group",
      )}
    >
      {/* User — avatar + name + email */}
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
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {user.role_name}
      </TableCell>

      {/* Joined date — the API tracks created_at, not a live "last active"
          timestamp, so this reflects what we can actually show truthfully */}
      <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
        {new Date(user.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      {/* Status */}
      <TableCell>
        <UserStatusBadge
          status={user.is_active === 1 ? "Active" : "Inactive"}
        />
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-4">
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-emerald-800"
            onClick={() => onView(user)}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-emerald-800"
            onClick={() => onEdit(user)}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {user.role_name === "Doctor" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-emerald-800"
              onClick={() => onDeactivate(user)}
              disabled={isDeactivating}
              title="Deactivate"
            >
              <UserX className="w-4 h-4" />
            </Button>
          ) : null}
          {user.role_name !== "Doctor" && user.user_id !== currentUserId ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-emerald-900"
              onClick={() => onDelete(user)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
});
