"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoricalPatient } from "@/lib/types/doctor";

type DownloadReportModalProps = {
  patient: HistoricalPatient | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export function DownloadReportModal({
  patient,
  onClose,
  onConfirm,
  isLoading,
}: DownloadReportModalProps) {
  return (
    <Dialog open={Boolean(patient)} onOpenChange={(open) => !open && onClose()}>
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            {isLoading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
