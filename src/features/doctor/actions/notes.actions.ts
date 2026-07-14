"use server";

import { deleteStudyNote, saveStudyNotes } from "../api/notes.api";

// save patient notes action
export async function savePatientNotesAction(
  study_id: string,
  notes: string,
  note_id?: string | null,
) {
  return saveStudyNotes(study_id, notes, note_id);
}

// delete patient note
export async function deletePatientNoteAction(
  study_id: string,
  note_id: string,
) {
  return deleteStudyNote(study_id, note_id);
}
