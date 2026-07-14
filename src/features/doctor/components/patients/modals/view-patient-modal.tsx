import { ActivePatient } from "@/lib/types/doctor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// VIEW
export function ViewPatientModal({
  patient,
  onClose,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
  onMarkComplete?: (id: string) => void;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Patient Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {patient?.first_name} {patient?.last_name}
          </DialogDescription>
        </DialogHeader>
        {patient && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 [word-break:break-word]">
            <div>
              <p className="text-gray-400 text-xs">First Name</p>
              <p className="font-medium">{patient.first_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Last Name</p>
              <p className="font-medium">{patient.last_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">National ID</p>
              <p className="font-mono font-medium">{patient.national_id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Image</p>
              <p className="font-medium">{patient.study}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Report Status</p>
              <p className="font-medium capitalize">{patient.report_status}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Patient Status</p>
              <p className="font-medium">{patient.patient_status}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Received Date</p>
              <p className="font-medium">{patient.received_date}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Image Numbers</p>
              <p className="font-medium">{patient.image_numbers}</p>
            </div>
            {patient.description && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Description</p>
                <p className="font-medium">{patient.description}</p>
              </div>
            )}
            {patient.notes && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Notes</p>
                <p className="font-medium">{patient.notes}</p>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
