import { ResetPasswordForm } from "@/features/auth";

// metadata for reset password page
export const metadata = {
  title: "Reset Password | Medivance",
  description: "Set a new password for your Medivance account",
};

// reset password page component, receives token from URL params and passes it to the form
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
