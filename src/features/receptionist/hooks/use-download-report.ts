import { useState } from "react";
import { downloadReportAction } from "../actions/patients.actions";
import { toast } from "sonner";

const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;

export function useDownloadReport() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (study_id: string) => {
    setIsDownloading(true);
    try {
      const res = await downloadReportAction(study_id);

      if (!res.success || !res.base64) {
        toast.error(res.message || "Failed to download report");
        return;
      }

      // validate base64 before calling atob to prevent crashes/XSS vulnerabilities
      if (!BASE64_REGEX.test(res.base64)) {
        toast.error("Invalid report data received");
        return;
      }

      try {
        const binary = atob(res.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${study_id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Report downloaded successfully!");
      } catch {
        toast.error("Failed to decode report");
      }
    } catch {
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}
