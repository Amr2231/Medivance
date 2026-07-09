import { cn } from "@/lib/utils/tailwind-merge";

export type UserStatus = "Active" | "Inactive";
export type InactiveStatus = "Inactive" | "Ready for Deletion";

// types
export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const config: Record<UserStatus, string> = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config[status],
      )}
    >
      {status}
    </span>
  );
};

// inactive shadow badge
export const InactiveStatusBadge = ({ status }: { status: InactiveStatus }) => {
  const config: Record<InactiveStatus, string> = {
    Inactive: "bg-red-50 text-red-700 border-red-200",
    "Ready for Deletion": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config[status],
      )}
    >
      {status}
    </span>
  );
};
