import type { User } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";

// component
export function ViewUserModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {/* title */}
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-200">
            User Details
          </DialogTitle>

          {/* description and name */}
          <DialogDescription className="text-sm text-gray-500">
            View information for {user?.first_name} {user?.last_name}
          </DialogDescription>
        </DialogHeader>

        {/* user details */}
        {user && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            {/* first name */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">First Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.first_name}
              </p>
            </div>

            {/* last name */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Last Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.last_name}
              </p>
            </div>

            {/* username */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Username</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">
                {user.username ?? "—"}
              </p>
            </div>

            {/* email */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Email</p>
              <p
                className="font-medium text-gray-900 dark:text-gray-100 truncate"
                title={user.email ?? "—"}
              >
                {user.email ?? "—"}
              </p>
            </div>

            {/* role */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Role</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.role_name}
              </p>
            </div>

            {/* created date */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Created Date</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(user.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* status */}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Status</p>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                  user.is_active === 1
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200",
                )}
              >
                {user.is_active === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
