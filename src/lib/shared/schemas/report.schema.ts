import { z } from "zod";

export const reportSchema = z.object({
  notes: z
    .string()
    .min(1, "Report content is required")
    .max(10_000, "Report is too long"),
});

export type ReportFormValues = z.infer<typeof reportSchema>;