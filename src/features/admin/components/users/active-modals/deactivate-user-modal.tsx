"use client";
import { useQuery } from "@tanstack/react-query";
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
import { getDoctorsAction } from "../../../actions/users.actions";

// types
type DeactivateProps = {
  user: User | null;
  onClose: () => void;
  onConfirm: (newDoctorId?: number) => void;
  isPending?: boolean;
};

// component
export function DeactivateUserModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: DeactivateProps) {
  const isDoctor = user?.role_name === "Doctor";

  // Fetch active doctors from backend
  useQuery({
    queryKey: ["doctors-active"],
    queryFn: getDoctorsAction,
    enabled: isDoctor && !!user,
    staleTime: 60_000,
  });

  // user not found
  if (!user) return null;

  // handle confirm
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent key={user.user_id} className="max-w-md">
        {/* header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Deactivate Account
          </DialogTitle>

          {/* description */}
          <DialogDescription className="text-sm text-orange-600">
            {isDoctor
              ? "This doctor has patients. Select a doctor to transfer them to first."
              : "This user will lose access to the system."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-3 space-y-0.5">
            {/* title , user name and role */}
            <p className="text-xs text-gray-400 dark:text-gray-300">
              User to be deactivated
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {user.role_name}
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
            onClick={handleConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending
              ? isDoctor
                ? "Transferring..."
                : "Deactivating..."
              : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
