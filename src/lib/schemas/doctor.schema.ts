import { z } from "zod";

export const patientNotesSchema = z.object({
  notes: z
    .string()
    .max(1000, "Notes must be at most 1000 characters")
    .optional()
    .default(""),
});

export type PatientNotesFormValues = z.infer<typeof patientNotesSchema>;
