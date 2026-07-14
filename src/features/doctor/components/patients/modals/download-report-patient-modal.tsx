import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// DOWNLOAD REPORT
export function DownloadReportModal({
  patient,
  onClose,
  onConfirm,
}: {
  patient: { first_name: string; last_name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Download Report
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to download the report for{" "}
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {patient?.first_name} {patient?.last_name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
