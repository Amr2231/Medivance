import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ActivePatient } from "@/lib/types/receptionist";

export function DeletePatientModal({
  patient,
  onClose,
  onConfirm,
  isPending,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Deactivate Patient
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            This will deactivate{" "}
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {patient?.first_name} {patient?.last_name}
            </span>
            &apos;s account. The patient can be reactivated later by an admin.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" disabled={isPending} onClick={onConfirm}>
            {isPending ? "Deactivating..." : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
