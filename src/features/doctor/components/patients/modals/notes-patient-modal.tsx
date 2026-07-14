"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Pencil, Trash2, X } from "lucide-react";
import type { ActivePatient } from "@/lib/types/doctor";
import { usePatientNotes } from "../../../hooks/use-patient-notes";

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export function PatientNotesModal({
  patient,
  onClose,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
}) {
  if (!patient) return null;

  return (
    <PatientNotesModalContent
      key={`${patient.id}-${patient.studies?.study_id ?? 0}`}
      patient={patient}
      onClose={onClose}
    />
  );
}

function PatientNotesModalContent({
  patient,
  onClose,
}: {
  patient: ActivePatient;
  onClose: () => void;
}) {
  const {
    form,
    onSubmit,
    isPending,
    isDeleting,
    notes,
    editingNoteId,
    startEdit,
    cancelEdit,
    deleteNote,
  } = usePatientNotes(patient, onClose);

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const notesValue = watch("notes");
  const isEditing = editingNoteId !== null;

  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#059669]" />
            Patient Notes
          </DialogTitle>

          <DialogDescription asChild>
            <div className="flex flex-col pt-1">
              <span className="font-medium text-gray-900">
                {patient?.first_name} {patient?.last_name}
              </span>
              <span className="text-xs text-gray-400">
                {patient?.national_id}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden gap-4"
        >
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* ── Note Input (Add / Edit) ─────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500">
                  {isEditing ? (
                    <span className="flex items-center gap-1 text-[#059669]">
                      <Pencil className="w-3 h-3" />
                      Editing note
                    </span>
                  ) : (
                    "Add Note"
                  )}
                </label>

                {notesValue && (
                  <span className="text-[11px] text-gray-400">
                    {notesValue.length} / 1000
                  </span>
                )}
              </div>

              <Textarea
                {...register("notes")}
                placeholder={
                  isEditing
                    ? "Edit your note..."
                    : "Write a note for this patient..."
                }
                rows={4}
                className={`resize-none transition-colors ${
                  isEditing
                    ? "border-[#059669]/40 ring-1 ring-[#059669]/20"
                    : ""
                }`}
              />

              {errors.notes && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.notes.message}
                </p>
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="mt-1 text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel edit
                </button>
              )}
            </div>

            {/* ── Previous Notes ──────────────────────────────────── */}
            {notes.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Previous Notes
                  <span className="ml-1 text-gray-400">({notes.length})</span>
                </p>

                <div className="space-y-2">
                  {[...notes].reverse().map((note, index) => {
                    const noteKey = note.id ?? `note-${index}`;
                    const isBeingEdited = editingNoteId === noteKey;
                    const isBeingDeleted = isDeleting === noteKey;

                    return (
                      <div
                        key={noteKey}
                        className={`border rounded-lg px-3 py-2 transition-colors ${
                          isBeingEdited
                            ? "border-[#059669]/40 bg-[#059669]/5"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-800 flex-1">
                            {note.text}
                          </p>

                          <div className="shrink-0 flex items-center gap-1">
                            {/* Edit button */}
                            {!isBeingEdited && (
                              <button
                                type="button"
                                onClick={() => startEdit(noteKey)}
                                disabled={isBeingDeleted}
                                className="text-gray-400 hover:text-[#059669] transition-colors p-0.5 rounded disabled:opacity-40"
                                title="Edit this note"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete button */}
                            {!isBeingEdited && (
                              <button
                                type="button"
                                onClick={() => deleteNote(noteKey)}
                                disabled={isBeingDeleted || isPending}
                                className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded disabled:opacity-40"
                                title="Delete this note"
                              >
                                {isBeingDeleted ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* Editing badge */}
                            {isBeingEdited && (
                              <span className="text-[10px] text-[#059669] font-medium bg-[#059669]/10 px-1.5 py-0.5 rounded">
                                Editing
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[11px] text-gray-400">
                            {note.created_at
                              ? formatTime(note.created_at)
                              : "Recently"}
                          </span>
                          {"edited_at" in note && note.edited_at && (
                            <>
                              <span className="text-[11px] text-gray-400">
                                ·
                              </span>
                              <span className="text-[11px] text-gray-400 italic">
                                edited
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No previous notes</p>
            )}
          </div>

          {/* Footer  */}
          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Close
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={cancelEdit}
                disabled={isPending}
                className="text-gray-500"
              >
                Cancel Edit
              </Button>
            )}

            <Button
              type="submit"
              disabled={isPending || !notesValue?.trim()}
              className="bg-[#059669] hover:bg-[#047857] text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Note"
              ) : (
                "Add Note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
