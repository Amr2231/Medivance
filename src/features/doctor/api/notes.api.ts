import { doctorFetch } from "./client";
import type { MutationResponse, StudyNote } from "@/lib/types/doctor";

// type
export type NotesMutationResponse = MutationResponse & {
  notes?: StudyNote[];
};

// save study notes
export async function saveStudyNotes(
  studyId: string,
  notes: string,
  noteId?: string | null,
): Promise<NotesMutationResponse> {
  return doctorFetch<NotesMutationResponse>(`/studies/${studyId}/notes`, {
    method: "PATCH",
    body: JSON.stringify({
      notes,
      ...(noteId ? { note_id: noteId } : {}),
    }),
  });
}

// delete study note
export async function deleteStudyNote(
  studyId: string,
  noteId: string,
): Promise<NotesMutationResponse> {
  return doctorFetch<NotesMutationResponse>(
    `/studies/${studyId}/notes/${noteId}`,
    { method: "DELETE" },
  );
}
