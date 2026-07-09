import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/admin";

// component
export function DeleteUserModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: {
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      {/* dialog */}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          {/* title */}
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Delete User
          </DialogTitle>

          {/* description and name */}
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {user?.first_name} {user?.last_name} ?
            </span>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirm}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
