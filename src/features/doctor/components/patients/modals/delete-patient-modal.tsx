import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ActivePatient } from "@/lib/types/doctor";

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
          <DialogTitle className="text-lg font-bold text-gray-900">
            Delete Patient
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to deactivate{" "}
            <span className="font-medium text-gray-800">
              {patient?.first_name} {patient?.last_name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
