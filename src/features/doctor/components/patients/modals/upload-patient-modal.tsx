"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadStudyImages } from "@/features/doctor/hooks/use-studies";
import { ActivePatient } from "@/lib/types/doctor";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

function UploadImageForm({
  patient,
  onClose,
}: {
  patient: ActivePatient;
  onClose: () => void;
}) {
  const [viewType, setViewType] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles(Array.from(incoming));
  };

  const { mutate: upload, isPending } = useUploadStudyImages(
    patient.studies.study_id ? String(patient.studies.study_id) : "",
  );

  const handleUpload = () => {
    if (!files.length || !viewType) return;
    upload({ files, view_type: viewType }, { onSuccess: () => onClose() });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Upload Images
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Upload images for {patient.first_name} {patient.last_name}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        <div>
          <p className="text-xs text-gray-400 mb-1">Image Type</p>
          <Input
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            placeholder="Enter Image Type..."
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById("fileInput")?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-200 hover:border-gray-300",
          )}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Drag & drop images here</p>
          <p className="text-xs text-gray-400 mt-1">
            or <span className="text-emerald-500 underline">browse files</span>
          </p>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2 mt-3">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md text-sm"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-xs text-gray-400">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isPending || !files.length || !viewType}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={handleUpload}
        >
          <Upload />
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function UploadImageModal({
  patient,
  onClose,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {patient ? (
          <UploadImageForm
            key={patient.national_id}
            patient={patient}
            onClose={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
