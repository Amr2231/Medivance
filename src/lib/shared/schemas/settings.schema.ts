import { z } from "zod";

/** Shared profile fields for admin + doctor settings */
export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(50, "Last name is too long"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

/** UI uses confirm_password; API adapters map to confirm_new_password when needed */
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;