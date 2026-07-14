import { doctorFetch, getApiBase } from "./client";
import { getAuthHeaders } from "@/lib/shared/api/server-client";
import type { MutationResponse } from "@/lib/types/doctor";

// type
export type StudyImageResponse = {
  success: boolean;
  data: string | null;
  mimeType: string | null;
};

// fetch study image
export async function fetchStudyImage(
  studyId: string,
  imageId: number,
): Promise<StudyImageResponse> {
  try {
    const headers = await getAuthHeaders(false);
    const res = await fetch(
      `${getApiBase()}/studies/${studyId}/images/${imageId}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return { success: false, data: null, mimeType: null };
    }

    const contentType =
      res.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return { success: true, data: base64, mimeType: contentType };
  } catch {
    return { success: false, data: null, mimeType: null };
  }
}

// delete study image
export async function deleteStudyImage(
  studyId: string,
  imageId: number,
): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(
    `/studies/${studyId}/images/${imageId}`,
    { method: "DELETE" },
  );
}
