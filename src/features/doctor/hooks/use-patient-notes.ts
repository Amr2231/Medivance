"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorKeys } from "../constants/query-keys";
import { useZodForm } from "@/lib/shared/forms/create-zod-form";
import { patientNotesSchema } from "../validation/schemas";
import {
  deletePatientNoteAction,
  savePatientNotesAction,
} from "../actions/notes.actions";
import type { ActivePatient, StudyNote } from "@/lib/types/doctor";

function deriveNotes(patient: ActivePatient): StudyNote[] {
  return Array.isArray(patient.studies?.notes)
    ? [...patient.studies.notes]
    : [];
}

export function usePatientNotes(
  patient: ActivePatient | null,
  onClose: () => void,
) {
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    patient ? deriveNotes(patient) : [],
  );
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useZodForm(patientNotesSchema, {
    defaultValues: { notes: "" },
  });

  const startEdit = (noteId: string) => {
    const note = notes.find((entry) => entry.id === noteId);
    if (!note) return;
    form.setValue("notes", note.text);
    setEditingNoteId(noteId);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    form.reset({ notes: "" });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!patient?.studies?.study_id) return;

    setIsPending(true);

    try {
      const response = await savePatientNotesAction(
        String(patient.studies.study_id),
        values.notes ?? "",
        editingNoteId,
      );

      if (response?.success === false) {
        toast.error(response.message ?? "Failed to save notes");
        return;
      }

      if (response.notes) {
        setNotes(response.notes);
      } else if (editingNoteId) {
        setNotes((previous) =>
          previous.map((note) =>
            note.id === editingNoteId
              ? {
                  ...note,
                  text: values.notes ?? "",
                  edited_at: new Date().toISOString(),
                }
              : note,
          ),
        );
      } else {
        setNotes((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            text: values.notes ?? "",
            doctor: patient.assigned_doctor ?? "Doctor",
            created_at: new Date().toISOString(),
            edited_at: null,
          },
        ]);
      }

      toast.success(
        editingNoteId ? "Note updated successfully" : "Note added successfully",
      );
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
      queryClient.invalidateQueries({ queryKey: doctorKeys.watchlist });
      form.reset({ notes: "" });
      setEditingNoteId(null);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  });

  const deleteNote = async (noteId: string) => {
    if (!patient?.studies?.study_id) return;

    setIsDeleting(noteId);

    try {
      const response = await deletePatientNoteAction(
        String(patient.studies.study_id),
        noteId,
      );

      if (response?.success === false) {
        toast.error(response.message ?? "Failed to delete note");
        return;
      }

      if (response.notes) {
        setNotes(response.notes);
      } else {
        setNotes((previous) => previous.filter((note) => note.id !== noteId));
      }

      if (editingNoteId === noteId) cancelEdit();

      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
      queryClient.invalidateQueries({ queryKey: doctorKeys.watchlist });
      toast.success("Note deleted");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    isDeleting,
    notes,
    editingNoteId,
    startEdit,
    cancelEdit,
    deleteNote,
    onClose,
  };
}
