"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, AlertCircle, Trash2, Check } from "lucide-react";
import {
  deleteStudyImageAction,
  getStudyImageAction,
} from "../../actions/images.actions";
import { toast } from "sonner";

// Types
type Props = {
  studyId: string;
  imageId: number;
  fileFormat: string;
  viewType: string;
  filePath?: string;
  isSelected?: boolean;
  onSelect?: (imageId: number) => void;
  onDeleted?: (imageId: number) => void;
};

// Utils functions
function isDicom(format: string, path?: string) {
  const combined = `${format} ${path ?? ""}`.toLowerCase();
  return ["dcm", "dicom", "application/dicom"].some((t) =>
    combined.includes(t),
  );
}

function isVideo(format: string) {
  return ["video", "avi", "mp4", "mov", "wmv", "mkv"].some((t) =>
    format.toLowerCase().includes(t),
  );
}

// DICOM Viewer [convert to canvas ]
function DicomViewer({ base64 }: { base64: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !base64) return;

    const load = async () => {
      try {
        const dicomParser = (await import("dicom-parser")).default;
        const jpegJs = await import("jpeg-js");

        // Convert base64 to Uint8Array
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        // Parse DICOM
        const dataSet = dicomParser.parseDicom(bytes);
        const rows = dataSet.uint16("x00280010") ?? 0;
        const cols = dataSet.uint16("x00280011") ?? 0;
        const transferSyntax = dataSet.string("x00020010") ?? "";
        const pixelDataElement = dataSet.elements["x7fe00010"];

        if (!pixelDataElement || !rows || !cols) {
          setError(true);
          return;
        }

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const isBaselineJpeg =
          transferSyntax.includes("1.2.840.10008.1.2.4.50") ||
          transferSyntax.includes("1.2.840.10008.1.2.4.51");

        const isLosslessJpeg =
          transferSyntax.includes("1.2.840.10008.1.2.4.57") ||
          transferSyntax.includes("1.2.840.10008.1.2.4.70");

        const fragments = pixelDataElement.fragments;

        if (isBaselineJpeg && fragments && fragments.length > 0) {
          const frag = fragments[0];
          const jpegBytes = new Uint8Array(
            dataSet.byteArray.buffer,
            frag.position,
            frag.length,
          );

          const decoded = jpegJs.decode(jpegBytes, {
            useTArray: true,
            colorTransform: true,
          });

          canvas.width = decoded.width;
          canvas.height = decoded.height;
          const imageData = ctx.createImageData(decoded.width, decoded.height);
          imageData.data.set(decoded.data);
          ctx.putImageData(imageData, 0, 0);
        } else if (isLosslessJpeg && fragments && fragments.length > 0) {
          const lossless = await import("jpeg-lossless-decoder-js");
          const frag = fragments[0];
          const jpegBytes = new Uint8Array(
            dataSet.byteArray.buffer,
            frag.position,
            frag.length,
          );

          const decoder = new lossless.Decoder();
          const decoded = decoder.decode(jpegBytes.slice().buffer);

          canvas.width = cols;
          canvas.height = rows;
          const imageData = ctx.createImageData(cols, rows);

          let min = Infinity,
            max = -Infinity;
          for (let i = 0; i < decoded.length; i++) {
            if (decoded[i] < min) min = decoded[i];
            if (decoded[i] > max) max = decoded[i];
          }
          const range = max - min || 1;

          for (let i = 0; i < decoded.length; i++) {
            const v = ((decoded[i] - min) / range) * 255;
            const idx = i * 4;
            imageData.data[idx] = v;
            imageData.data[idx + 1] = v;
            imageData.data[idx + 2] = v;
            imageData.data[idx + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
        } else {
          // ===== Raw / Uncompressed pixels (زي ما هو) =====
          canvas.width = cols;
          canvas.height = rows;
          const bitsAllocated = dataSet.uint16("x00280100") ?? 16;
          const pixelData =
            bitsAllocated === 8
              ? new Uint8Array(
                  dataSet.byteArray.buffer,
                  pixelDataElement.dataOffset,
                  pixelDataElement.length,
                )
              : new Uint16Array(
                  dataSet.byteArray.buffer.slice(
                    pixelDataElement.dataOffset,
                    pixelDataElement.dataOffset + pixelDataElement.length,
                  ),
                );

          const imageData = ctx.createImageData(cols, rows);
          let min = Infinity,
            max = -Infinity;
          for (let i = 0; i < pixelData.length; i++) {
            if (pixelData[i] < min) min = pixelData[i];
            if (pixelData[i] > max) max = pixelData[i];
          }
          const range = max - min || 1;
          for (let i = 0; i < pixelData.length; i++) {
            const v = ((pixelData[i] - min) / range) * 255;
            const idx = i * 4;
            imageData.data[idx] = v;
            imageData.data[idx + 1] = v;
            imageData.data[idx + 2] = v;
            imageData.data[idx + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
        }
      } catch (err) {
        console.error("DICOM load error:", err);
        setError(true);
      }
    };

    load();
  }, [base64]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#0d1117] text-gray-400">
        <AlertCircle className="w-6 h-6 text-emerald-400" />
        <p className="text-xs">Failed to load DICOM</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
      style={{ background: "#000", minHeight: "200px" }}
    />
  );
}
// Video Viewer
function VideoViewer({
  base64,
  mimeType,
}: {
  base64: string;
  mimeType: string;
}) {
  const src = useMemo(() => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }, [base64, mimeType]);

  useEffect(() => {
    return () => URL.revokeObjectURL(src);
  }, [src]);

  return (
    <video
      src={src}
      controls
      className="w-full h-full object-contain bg-black"
      style={{ maxHeight: "100%" }}
    />
  );
}

// Image Viewer
function ImageViewer({
  base64,
  mimeType,
}: {
  base64: string;
  mimeType: string;
}) {
  return (
    // dynamic base64 medical imaging preview
    // eslint-disable-next-line @next/next/no-img-element -- next/image cannot optimize an in-memory data URL
    <img
      src={`data:${mimeType};base64,${base64}`}
      alt="Image"
      className="w-full h-full object-contain bg-black"
    />
  );
}

// Main Component
export function StudyImageViewer({
  studyId,
  imageId,
  fileFormat,
  viewType,
  filePath,
  isSelected = false,
  onSelect,
  onDeleted,
}: Props) {
  // state
  const [state, setState] = useState<{
    status: "loading" | "success" | "error";
    base64: string | null;
    mimeType: string | null;
  }>({ status: "loading", base64: null, mimeType: null });

  const [isDeleting, setIsDeleting] = useState(false);

  // get study image
  useEffect(() => {
    getStudyImageAction(studyId, imageId).then((res) => {
      if (res.success && res.data) {
        setState({
          status: "success",
          base64: res.data,
          mimeType: res.mimeType,
        });
      } else {
        setState({ status: "error", base64: null, mimeType: null });
      }
    });
  }, [studyId, imageId]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const res = await deleteStudyImageAction(studyId, imageId);
      if (res.success === false) {
        toast.error(res.message ?? "Failed to delete image");
        return;
      }
      toast.success("Image deleted");
      onDeleted?.(imageId);
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={() => onSelect?.(imageId)}
      className={`relative aspect-square rounded-lg overflow-hidden bg-[#0d1117] transition-all cursor-pointer
        ${
          isSelected
            ? "ring-2 ring-primary"
            : "hover:ring-2 hover:ring-primary/40"
        }`}
    >
      {/* View type label */}
      <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
        {viewType}
      </div>

      {/* Select indicator */}
      <div
        className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
        ${isSelected ? "bg-primary border-primary" : "border-white/70 bg-black/30"}`}
      >
        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full bg-destructive/85 flex items-center justify-center hover:bg-destructive transition-colors disabled:opacity-50"
        title="Delete image"
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5 text-white" />
        )}
      </button>

      {/* Content */}
      {state.status === "loading" && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        </div>
      )}
      {state.status === "error" && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-500">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-xs">Failed to load</p>
        </div>
      )}
      {state.status === "success" && state.base64 && state.mimeType && (
        <>
          {isDicom(fileFormat, filePath) ? (
            <DicomViewer base64={state.base64} />
          ) : isVideo(fileFormat) ? (
            <VideoViewer base64={state.base64} mimeType={state.mimeType} />
          ) : (
            <ImageViewer base64={state.base64} mimeType={state.mimeType} />
          )}
        </>
      )}
    </div>
  );
}
