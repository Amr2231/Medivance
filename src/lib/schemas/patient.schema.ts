import { z } from "zod";

import { STUDY } from "../constants/study.constants";

// ================= ADD PATIENT =================
export const addPatientSchema = z.object({
  first_name: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(10, "First name must be less than 10 characters")
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "First name must contain letters only",
    ),

  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(10, "Last name must be less than 10 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "Last name must contain letters only"),

  national_id: z
    .string()
    .nonempty("National ID is required")
    .regex(/^\d{14}$/, "National ID must be exactly 14 digits"),

  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),

  doctor_id: z
    .number({ required_error: "Doctor is required" })
    .int()
    .positive("Please select a doctor"),

  phone_number: z
    .string()
    .nonempty("Phone number is required")
    .regex(
      /^(010|011|012|015)\d{8}$/,
      "Invalid Egyptian phone number (010/011/012/015 + 8 digits)",
    ),

  study_type: z.enum(STUDY, {
    required_error: "Study type is required",
  }),

  study_date: z
    .string()
    .min(1, "Study date is required")
    .refine(
      (date) => {
        const selected = new Date(date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selected >= today;
      },
      {
        message: "Study date cannot be in the past",
      },
    ),
  appointment_time: z.string().min(1, "Please select an appointment time"),
});

export type AddPatientFields = z.infer<typeof addPatientSchema>;

// ================= UPDATE PATIENT =================
export const updatePatientSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name is required")
    .max(10, "First name must be less than 10 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "First name must contain letters only")
    .optional(),

  last_name: z
    .string()
    .min(2, "Last name is required")
    .max(10, "Last name must be less than 10 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "Last name must contain letters only")
    .optional(),

  phone_number: z
    .string()
    .min(11, "Phone number is required")
    .regex(
      /^(010|011|012|015)\d{8}$/,
      "Invalid Egyptian phone number (010/011/012/015 + 8 digits)",
    )
    .optional(),

  gender: z.enum(["Male", "Female"]).optional(),

  doctor_id: z.number().int().positive().optional(),

  study_type: z.enum(STUDY).optional(),

  study_date: z
    .string()
    .min(1, "Study date is required")
    .refine(
      (date) => {
        const selected = new Date(date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selected >= today;
      },
      {
        message: "Study date cannot be in the past",
      },
    ),

  national_id: z
    .string()
    .regex(/^\d{14}$/, "National ID must be exactly 14 digits")
    .optional(),
});

export type UpdatePatientFields = z.infer<typeof updatePatientSchema>;

// ================= REASSIGN DOCTOR =================
export const reassignDoctorSchema = z.object({
  doctor_id: z
    .number({ required_error: "Doctor is required" })
    .int()
    .positive("Please select a doctor"),

  study_type: z.enum(STUDY, {
    required_error: "Study type is required",
  }),

  study_date: z
    .string()
    .min(1, "Study date is required")
    .refine(
      (date) => {
        const selected = new Date(date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selected >= today;
      },
      {
        message: "Study date cannot be in the past",
      },
    ),
});

export type ReassignDoctorFields = z.infer<typeof reassignDoctorSchema>;
