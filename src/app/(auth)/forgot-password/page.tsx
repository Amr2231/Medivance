import { ForgotPasswordLayout } from "@/features/auth";

// metadata for forgot password page
export const metadata = {
  title: "Forgot Password | Medivance",
  description: "Reset your Medivance account password",
};

// forgot password page component
export default function ForgotPasswordPage() {
  return <ForgotPasswordLayout />;
}
