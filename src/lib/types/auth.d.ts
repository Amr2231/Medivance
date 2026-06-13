import { z } from "zod";
import {
  emailStepSchema,
  loginSchema,
  otpStepSchema,
} from "../schemas/auth.schema";
import { Forget_password_Steps } from "../constants/auth.constant";

// login response type
export type LoginResponse = {
  message: string;
  token: string;
  refreshToken: string;
  accessTokenExpiresAt?: string | number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    username?: string;
    email: string;
    role: string;
    created_at: string;
    account_status: string;
    accepted_terms: boolean;
  };
};

// login types
export type LoginFields = z.infer<typeof loginSchema>;

// forgot password types
export type ForgetPasswordSteps =
  (typeof Forget_password_Steps)[keyof typeof Forget_password_Steps];
export type EmailStepFields = z.infer<ReturnType<typeof emailStepSchema>>;
export type OtpStepFields = z.infer<ReturnType<typeof otpStepSchema>>;
