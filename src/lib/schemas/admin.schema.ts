import { z } from "zod";

export const editUserSchema = z.object({
  first_name: z
    .string()
    .nonempty("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(10, "First name must be at most 10 characters"),

  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(10, "Last name must be at most 10 characters"),

  username: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be at most 10 characters"),

  email: z.string().nonempty("Email is required").email("Invalid email format"),
});

export const addUserSchema = z
  .object({
    first_name: z
      .string()
      .nonempty("First name is required")
      .min(3, "First name must be at least 3 characters")
      .max(10, "First name must be at most 10 characters"),
    last_name: z
      .string()
      .nonempty("Last name is required")
      .min(3, "Last name must be at least 3 characters")
      .max(10, "Last name must be at most 10 characters"),
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(10, "Username must be at most 10 characters"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email format"),
    role_name: z.enum(["Doctor", "Receptionist", "Admin"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not exceed 30 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .refine(
        (val) =>
          !["password", "12345678", "qwerty"].includes(val.toLowerCase()),
        {
          message: "Password is too weak",
        },
      ),
    confirm_password: z
      .string()
      .nonempty("Confirm Password is required")
      .min(8, "Min 8 characters")
      .max(30, "Max 30 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const inactiveFiltersSchema = z.object({
  sortDate: z.enum(["newest", "oldest"]).default("newest"),
  filterRole: z.string().default("all"),
  created_date: z.string().optional(),
});

export const activeFiltersSchema = z.object({
  sortDate: z.enum(["newest", "oldest"]).default("newest"),
  filterRole: z.string().default("all"),
  filterDate: z.string().optional().default(""),
});
export const deactivatedPatientsFiltersSchema = z.object({
  sortDate: z.enum(["newest", "oldest"]).default("newest"),
  created_date: z.string().optional().default(""),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
export type AddUserSchema = z.infer<typeof addUserSchema>;
export type InactiveFiltersSchema = z.infer<typeof inactiveFiltersSchema>;
export type ActiveFiltersSchema = z.infer<typeof activeFiltersSchema>;