import { LoginForm } from "@/features/auth";

// metadata for login page
export const metadata = {
  title: "Login | Medivance",
  description: "Sign in to your Medivance account",
};

// login page component
export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
