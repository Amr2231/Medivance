import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("email is required").email("Invalid email format"),
  password: z.string().nonempty("please enter your password"),
  rememberMe: z.boolean().optional().default(false),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Policies to continue",
  }),
});

// Forgot password schemas
export const emailStepSchema = () => loginSchema.pick({ email: true });
export const otpStepSchema = () =>
  z.object({
    otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
  });

export const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetFields = z.infer<typeof resetSchema>;
