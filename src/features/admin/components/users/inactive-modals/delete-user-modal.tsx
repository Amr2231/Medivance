import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { InactiveUser } from "@/lib/types/admin";
import { AlertTriangle } from "lucide-react";

// types
type DeleteProps = {
  user: InactiveUser | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  isPending?: boolean;
};

// component
export function DeleteInactiveModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: DeleteProps) {
  // user not found
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        {/* header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Delete Account
          </DialogTitle>

          {/* description */}
          <DialogDescription className="text-sm text-red-600">
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>

        {/* content */}
        <div className="py-2 space-y-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center space-y-1">
              {/* title */}
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Delete {user.fName} {user.lName}?
              </p>

              {/* description */}
              <p className="text-xs text-gray-500 leading-relaxed">
                This account will be{" "}
                <span className="font-medium text-red-600">
                  permanently deleted
                </span>
                . All associated data will be removed and cannot be recovered.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-3 space-y-0.5">
            <p className="text-xs text-gray-400">Account to be deleted</p>

            {/* name */}
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.fName} {user.lName}
            </p>

            {/* role */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
        </div>

        {/* footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => onConfirm(user.id)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
